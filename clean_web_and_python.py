from __future__ import annotations
import argparse
import ast
import io
import os
import re
import sys
import tokenize
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator, List, Tuple
DEFAULT_INDENT = 4
IGNORE_DIRS = {'.git', '__pycache__', 'node_modules', 'venv', '.venv', '.mypy_cache', '.pytest_cache'}
PY_EXTS = {'.py'}
HTML_EXTS = {'.html', '.htm'}
CSS_EXTS = {'.css'}
ALL_EXTS = PY_EXTS | HTML_EXTS | CSS_EXTS
VOID_HTML_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

@dataclass
class Result:
    path: Path
    changed: bool
    reason: str

def iter_target_files(root: Path, include_hidden: bool=False) -> Iterator[Path]:
    for (dirpath, dirnames, filenames) in os.walk(root):
        p = Path(dirpath)
        dirnames[:] = [d for d in dirnames if (include_hidden or not d.startswith('.')) and d not in IGNORE_DIRS]
        for name in filenames:
            if not include_hidden and name.startswith('.'):
                continue
            ext = Path(name).suffix.lower()
            if ext in ALL_EXTS:
                yield (p / name)

def normalize_whitespace(s: str, indent_size: int) -> str:
    s = s.replace('\r\n', '\n').replace('\r', '\n')
    lines = s.split('\n')
    out: List[str] = []
    for line in lines:
        line = line.expandtabs(indent_size).rstrip()
        out.append(line)
    collapsed: List[str] = []
    blank_run = 0
    for line in out:
        if line.strip() == '':
            blank_run += 1
            if blank_run <= 1:
                collapsed.append('')
        else:
            blank_run = 0
            collapsed.append(line)
    text = '\n'.join(collapsed)
    if not text.endswith('\n'):
        text += '\n'
    return text

def remove_python_comments(code: str) -> str:
    buff = io.StringIO(code)
    tokens = tokenize.generate_tokens(buff.readline)
    new_tokens = []
    prev_end = (1, 0)
    for tok in tokens:
        (tok_type, tok_str, start, end, line) = tok
        if tok_type == tokenize.COMMENT:
            continue
        new_tokens.append(tok)
        prev_end = end
    return tokenize.untokenize(new_tokens)

class _DocstringStripper(ast.NodeTransformer):

    def visit_Module(self, node: ast.Module) -> ast.AST:
        self.generic_visit(node)
        node.body = self._strip_leading_docstring(node.body)
        return node

    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.AST:
        self.generic_visit(node)
        node.body = self._strip_leading_docstring(node.body)
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AST:
        self.generic_visit(node)
        node.body = self._strip_leading_docstring(node.body)
        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.AST:
        self.generic_visit(node)
        node.body = self._strip_leading_docstring(node.body)
        return node

    @staticmethod
    def _is_docstring(expr: ast.stmt) -> bool:
        return isinstance(expr, ast.Expr) and isinstance(expr.value, ast.Constant) and isinstance(expr.value.value, str)

    def _strip_leading_docstring(self, body: List[ast.stmt]) -> List[ast.stmt]:
        if body and self._is_docstring(body[0]):
            return body[1:]
        return body

def format_python(code: str) -> str:
    no_comments = remove_python_comments(code)
    try:
        tree = ast.parse(no_comments)
        tree = _DocstringStripper().visit(tree)
        ast.fix_missing_locations(tree)
        formatted = ast.unparse(tree)
        if not formatted.endswith('\n'):
            formatted += '\n'
        return formatted
    except SyntaxError:
        return no_comments if no_comments.endswith('\n') else no_comments + '\n'
_HTML_COMMENT_RE = re.compile('<!--.*?-->', re.DOTALL)
_CSS_COMMENT_RE = re.compile('/\\*.*?\\*/', re.DOTALL)

def remove_css_comments(s: str) -> str:
    return _CSS_COMMENT_RE.sub('', s)

def remove_html_comments(s: str) -> str:
    return _HTML_COMMENT_RE.sub('', s)
_TAG_OPEN_RE = re.compile('<\\s*([a-zA-Z0-9:_-]+)(?=[\\s>/])')
_TAG_CLOSE_RE = re.compile('</\\s*([a-zA-Z0-9:_-]+)\\s*>')
_SELF_CLOSE_RE = re.compile('/\\s*>$')

def reindent_css(s: str, indent_size: int) -> str:
    depth = 0
    out = []
    for raw_line in s.split('\n'):
        line = raw_line.strip()
        closes = line.count('}')
        opens = line.count('{')
        pre_depth = depth - closes
        if pre_depth < 0:
            pre_depth = 0
        indented = ' ' * (indent_size * pre_depth) + line
        out.append(indented)
        depth = max(0, pre_depth + opens)
    return '\n'.join(out) + ('\n' if not s.endswith('\n') else '')

def _is_void_tag(tag: str) -> bool:
    return tag.lower() in VOID_HTML_TAGS

def reindent_html(s: str, indent_size: int) -> str:
    out: List[str] = []
    depth = 0
    for raw_line in s.split('\n'):
        line = raw_line.strip()
        if not line:
            out.append('')
            continue
        starts_with_close = bool(_TAG_CLOSE_RE.match(line))
        open_tags = [m.group(1) for m in _TAG_OPEN_RE.finditer(line)]
        closes = len(_TAG_CLOSE_RE.findall(line))
        self_closing = bool(_SELF_CLOSE_RE.search(line))
        pre_depth = depth - (1 if starts_with_close else 0)
        pre_depth = max(0, pre_depth)
        out.append(' ' * (indent_size * pre_depth) + line)
        delta_open = 0
        for t in open_tags:
            if not _is_void_tag(t) and (not self_closing):
                delta_open += 1
        depth = max(0, pre_depth + delta_open - closes)
    text = '\n'.join(out)
    if not text.endswith('\n'):
        text += '\n'
    return text

def process_file(path: Path, indent_size: int) -> Tuple[str, str]:
    original = path.read_text(encoding='utf-8', errors='replace')
    ext = path.suffix.lower()
    if ext in PY_EXTS:
        cleaned = format_python(original)
        cleaned = normalize_whitespace(cleaned, indent_size)
        return (original, cleaned)
    if ext in CSS_EXTS:
        s = remove_css_comments(original)
        s = reindent_css(s, indent_size)
        s = normalize_whitespace(s, indent_size)
        return (original, s)
    if ext in HTML_EXTS:
        s = remove_html_comments(original)
        s = reindent_html(s, indent_size)
        s = normalize_whitespace(s, indent_size)
        return (original, s)
    return (original, original)

def write_with_backup(path: Path, new_text: str, no_backup: bool) -> None:
    if not no_backup:
        bak = path.with_suffix(path.suffix + '.bak')
        if not bak.exists():
            bak.write_text(path.read_text(encoding='utf-8', errors='replace'), encoding='utf-8')
    path.write_text(new_text, encoding='utf-8')

def main(argv: List[str] | None=None) -> int:
    parser = argparse.ArgumentParser(description='Strip comments and fix indentation for .py, .html, .css files.')
    parser.add_argument('--root', type=Path, default=Path.cwd(), help='Root directory to process. Default: current dir.')
    parser.add_argument('--indent-size', type=int, default=DEFAULT_INDENT, help='Spaces per indent (default: 4).')
    parser.add_argument('--dry-run', action='store_true', help='Do not write files; print summary only.')
    parser.add_argument('--no-backup', action='store_true', help='Do not create .bak backups.')
    parser.add_argument('--include-hidden', action='store_true', help='Include hidden files and directories.')
    args = parser.parse_args(argv)
    total = 0
    changed = 0
    results: List[Result] = []
    for path in iter_target_files(args.root, include_hidden=args.include_hidden):
        total += 1
        try:
            (original, cleaned) = process_file(path, args.indent_size)
        except Exception as e:
            print(f'[ERROR] {path}: {e}', file=sys.stderr)
            continue
        if original != cleaned:
            results.append(Result(path=path, changed=True, reason='updated'))
            changed += 1
            if not args.dry_run:
                write_with_backup(path, cleaned, args.no_backup)
        else:
            results.append(Result(path=path, changed=False, reason='no-op'))
    if args.dry_run:
        for r in results:
            flag = 'CHANGE' if r.changed else 'OK'
            print(f'{flag}: {r.path}')
    print(f'\nProcessed: {total} file(s). Changed: {changed}. Unchanged: {total - changed}.')
    if args.dry_run:
        print('Dry run: no files were written.')
    elif not args.no_backup:
        print('Backups created with .bak extension (only if not already present).')
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
