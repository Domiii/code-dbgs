# Contributing

import Img from '@src/components/Img';
import TOC from '@src/components/TOC';

<TOC toc={toc} />

## Code of Conduct

TODO

## Development + Contributing: Getting Started

### Prerequisites

* `bash`
   * On Windows, you can get this via cygwin or `git` (which also installs cygwin)
* Recommended: [Volta](https://docs.volta.sh/guide/getting-started)
  * Please consider the [installation chapter](../01-installation.mdx#system-requirements) for pros, cons and installation instructions.
* `yarn`
* `Node@16`


### Setup

```sh
git clone https://github.com/Domiii/dbux.git
cd dbux
code dbux.code-workspace # open project in vscode
yarn install && yarn i # install dependencies
```

Finally, you might want to enable Dbux auto start by default:

<Img screen src="dbux-auto-start-workspace-setting.png" />


If dependencies bug out, sometimes running the (very aggressive) clean-up command can help: `npm run dbux-reinstall`.
Of course, we don't recommend this, unless absolutely necessary. It will delete your `yarn.lock` file, which can lead to installation of package versions that have breaking changes in them, potentially introducing even more problems.


### Start Development

1. Open project + start build+watch mode
   ```sh
   code dbux.code-workspace # open project in VSCode
   yarn start # start webpack development build of all projects in watch mode
   ```
2. Go to your VSCode debug tab, select the `dbux-code` configuration and press F5. This runs the [Dbux VSCode Extension](../tools-and-configuration/01-dbux-code.mdx) in debug mode.
3. Inside the new window, you can then use [Dbux VSCode Extension](../tools-and-configuration/01-dbux-code.mdx) as usual (but in debug mode).


### Contribute to Docs

We use `docusaurus` for documentation.

1. Follow the [Setup](#setup) steps.
2. Run `code dbux.code-workspace` to open the Dbux project in VSCode
3. You can find all docs in the [`docs_site`](https://github.com/Domiii/dbux/blob/master/docs_site/content) folder. The `docs_site/content` folder houses most of the content source.
4. Run `yarn docs` to build + serve the docs locally (in `watch` mode), and test your changes.
5. Once you are done: run `yarn docs:build` (which does a few more pre-deployment checks)
6. If `yarn build` succeeds, feel free to send out a PR.


#### Build + Deploy docs

Inside of the `docs_site` folder:

* `yarn build`
  * -> Make sure, there are no build problems.
* `yarn serve`
  * This serves the production build locally to allow you manually test and check whether the documentation site works correctly.
  * You especially want to do this when introducing new complex logic or components.
* `yarn deploy`
  * Make the changes go live.

#### Documentation: Related Issues

* https://github.com/Domiii/dbux/labels/documentation.


## Joining the Community

While you can certainly try to get started on your own, you probably make your life a lot easier by [join the dev team on Discord](https://discord.gg/8kR2a7h) first :)

## Local Development Build

When you want to debug a local project with a local Dbux dev build, we recommend using `yalc`:

* Make sure you have the right `npm` and/or `yarn` versions, as explained [here](https://github.com/wclr/yalc/issues/187).
* In your local Dbux folder:
  * run `yarn yalc`
* Inside your target project folder:
  * `yalc add --dev @dbux/babel-plugin @dbux/runtime @dbux/cli @dbux/common @dbux/common-node @dbux/babel-register-fork`
  * Add to .gitignore:
    ```
    .yalc
    yalc.lock
    ```
* NOTE: Sometimes (but rarely), the build cache needs to be flushed.
  * E.g. when using `webpack` and `babel`: `rm -rf ./node_modules/.cache/babel-loader`


* TODO: test the `workspace` and `pure` options (described [here](https://github.com/wclr/yalc/issues/180))

:::caution
This will not work with `yarn@1`.

While generally linking the local dev build using `yalc` works, it will not be able to install dependencies, and in general, `yarn add` and `yarn install` will always fail from now on, if you use `yarn@1`. [This is a well-known bug that was fixed for `yarn@>=2`.](https://github.com/yarnpkg/yarn/issues/2611)

One way to hackfix this with `yarn@1`:
* After `yalc add...`:
  * (If you use `yarn workspaces`: remove linkage to other workspace packages.)
  * Use `npm install` once, then remove `package-lock.json`.
  * (Bring back other workspace packages if needed.)
  * If you use webpack or other bundlers, make sure, `.yalc` folder is in your `resolve.modules` (or other bundler's equivalent).
* Whenever you need to change things with `yarn add/remove`, first remove `yalc` packages, then bring them back:
  ```sh
  yalc remove --all
  yalc add ...
  ```

PROBLEM: (one of many) since `npm install` ignores your `yarn.lock`, and also might undo (some) deduplication, your dependencies might get real messy real fast. That is especially due to libraries often not following the convention of only introducing breaking changes with major releases. Meaning that all libraries that were added with (usual default of) [caret (^)](https://www.google.com/search?q=semver+caret+meaning) can potentially break due to this.
:::


#### Related

* [Issue: Propose a local development workflow](https://github.com/Domiii/dbux/issues/661).



## More Unsorted Notes

### Adding dependencies

We use Lerna with Yarn workspaces, so if you need to install a new package, instead of `npm install pkg`, we do the following:

* Adding `pkg` to `@dbux/something` (where `dbux-something` is the folder containing the package `@dbux/something`):
   `npx lerna add --scope=@dbux/something pkg`
   `npx lerna add --scope=@dbux/common pkg`
   `npx lerna add --scope=dbux-code pkg      # note: dbux-code's package name has a dash (-), not a slash (/)!`
* Adding `pkg` to the root's `devDependencies`:
   `yarn add --dev -W pkg`


<!-- ### Local Development Build

If you want to use the local development build of Dbux in other folders, make sure to hard-link them.

E.g. on Windows:

```ps
mkdir ..\..\node_modules\@dbux
mklink /J ..\..\node_modules\@dbux\babel-plugin ..\..\..\dbux\dbux-babel-plugin
mklink /J ..\..\node_modules\@dbux\runtime ..\..\..\dbux\dbux-runtime
``` -->


### VSCode extension development

This section holds a few basics of VSCode extension development.

#### Adding a command/button

NOTE: VSCode's buttons are representation of commands, you must add a command before adding a button.

1. Register command in `contributes.commands` section of package.json as following(title and icon are optional):
    ``` json
    {
      "commands": [
        {
          "command": "<COMMAND_ID>",
          "title": "<TITLE>",
          "icon": {
            "light": "<PATH_TO_YOUR_ICON>",
            "dark": "<PATH_TO_YOUR_ICON>"
          }
        }
      ]
    }
    ```
1. Bind the command with a callback function in js file:
    ``` js
    import { registerCommand } from './commands/commandUtil';
    registerCommand(context, '<COMMAND_ID>', callback);
    ```
1. Depends on whether the command should be shown in command palette, add the following to `contributes.menus.commandPalette` section in package.json:
    Show command in command palette
    (use `"when": "!dbux.context.activated"` instead if you want show it before dbux has been activated)
    ``` json
    {
      "commantPalette": [
        {
          "command": "<COMMAND_ID>",
          "when": "dbux.context.activated"
        }
      ]
    }
    ```
    Hide command from command palette
    ``` json
    {
      "commantPalette": [
        {
          "command": "<COMMAND_ID>",
          "when": "false"
        }
      ]
    }
    ```

1. Finally, configure where the button should be shown (skip this step if you don't want a button):
    To show button in...
    - navigation bar(upper-right corner), add the following to `contributes.menus.editor/title`
    ``` json
    {
      "editor/title": [
        {
          "command": "<COMMAND_ID>",
          "when": "dbux.context.activated",
          "group": "navigation"
        } 
      ] 
    }
    ```
    - tree view title, add the following to `contributes.menus.view/title`
      ( `<VIEW_ID>` is defined in `contributes.views.dbuxViewContainer` section)
    ``` json
    {
      "view/title": [
        {
          "command": "<COMMAND_ID>",
          "when": "view == <VIEW_ID>",
          "group": "navigation"
        } 
      ] 
    }
    ```
    - tree view item, add the following to `contributes.menus.view/item/context`
      ( `<VIEW_ID>` is defined in `contributes.views.dbuxViewContainer` section and `<NODE_CONTEXT_ID>` is defined programmatically in `TreeItem.contextValue` )
    ``` json
    {
      "view/item/context": [
        {
          "command": "<COMMAND_ID>",
          "when": "view == <VIEW_ID> && viewItem == <NODE_CONTEXT_ID>",
          "group": "inline"
        }
      ]
    }
    ```

1. Some more Notes:
   - You can sort buttons by adding suffix `@<number>` to `group` property. e.g. `"group": "inline@5"`
   - If you remove `"group": "navigation"`, the button will be listed in a dropdown menu, see [Sorting of groups](https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups) for more information
   - The `when` property defines when should the button be visible, see ['when' clause contexts](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts) for more available condition

<!-- TODO: more to be said here in the future (e.g., consider https://gist.github.com/PurpleBooth/b24679402957c63ec426) -->

## How to use Dbux on Dbux?

TODO: we have not fully added support for this yet.

<!-- 
### How to "dbux" dbux-runtime?

#### Build it

→ We need a new version of `@dbux/runtime` that is built with and records things with `@dbux/runtime`. We call it the "incep" (short for "inception") version.

1. Set `@dbux/babel-plugin`'s cfg's `runtime.global` to `__dbux_incep__`
2. Add two new configs to `@dbux/runtime`'s `webpack` and add `@dbux/babel-plugin` to them: `index-${target}-incep`

#### Run it

1. Fix build/register pipelines:
   * `@dbux/cli` needs to allow customizing the `@dbux/runtime` being used.
   * webpack and other bundlers need to easily be able to load the `incep`, rather than the standard version.
2. Run it!
   * You should now see two different applications pop up in your Dbux frontend (e.g. `dbux-code`).

 -->
