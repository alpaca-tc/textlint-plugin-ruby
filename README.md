# textlint-plugin-ruby

Ruby plugin for [textlint](https://github.com/textlint/textlint)

## Install 

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --dev textlint-plugin-ruby
```

Install [textlint-ruby](https://github.com/alpaca-tc/textlint-ruby) with [gem](https://guides.rubygems.org/command-reference/#gem-install):

```sh
# requires >= 2.0.0
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
- `execCommand`: `string[]`
  - Default `["textlint-ruby", "--stdio"]`
  - Set [textlint-ruby](https://github.com/alpaca-tc/textlint-ruby) executable command

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
# Use gem installed with Gemfile.
{
  "plugins": {
    "ruby": {
      "execCommand": ["bundle", "exec", "textlint-ruby", "--stdio"]
    }
  }
}
```
