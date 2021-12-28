import React from 'react';
// import useBaseUrl from '../hooks/useBaseUrl';

const codeBaseUrl = 'https://github.com/Domiii/dbux/';

const pkgNames = {
  'dbux-code': 'Dbux VSCode Extension'
};

function join(a, b) {
  return `${(a && b) && `${a}/` || a || ''}${b || ''}`;
}

function getPkgName(pkg) {
  const name = pkgNames[pkg];
  if (name) {
    return name;
  }
  if (pkg.startsWith('dbux-')) {
    return `@dbux/${pkg.substring(5)}`;
  }
  return pkg;
}

export default function CodeLink({ path, children, title, ...moreProps }) {
  // const baseUrl = useBaseUrl();

  const prettyPath = getPkgName(path);
  children = children || prettyPath;
  title = title || children;

  const href = `${codeBaseUrl}${path}`; // join(pkg, path)

  return (
    <a title={title} href={href} {...moreProps}>{children}</a>
  );
}