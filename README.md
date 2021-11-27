# textlint-plugin-ruby

Ruby plugin for [textlint](https://github.com/textlint/textlint)

## Install 

**TODO: release packages**

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --dev textlint-plugin-ruby
```

Install [textlint-ruby](https://github.com/alpaca-tc/textlint-ruby) with [gem](https://guides.rubygems.org/command-reference/#gem-install):

```sh
$ gem install textlint-ruby
```

## Usage

Put following config to `.textlintrc`

```json
{
  "plugins": {
    "ruby": true
  }
}
```

### Options

- `extensions`: `string[]`
  - Additional file extensions for markdown
- `execPath`: `string`
  - Set [textlint-ruby](https://github.com/alpaca-tc/textlint-ruby) executable path

For example, if you want to treat custom extensions as ruby, put following config to `.textlintrc`

```json
{
  "plugins": {
    "ruby": {
      "extensions": [".rbx"]
    }
  }
}
```

For example, if you want to set specific `textlint-ruby` executable path, put following config to `.textlintrc`

```json
{
  "plugins": {
    "ruby": {
      "execPath": ["./path/to/textlint-ruby"]
    }
  }
}
```
