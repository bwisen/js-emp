# js-emp
break js, c, c++, c#, java and rust codes in an unnoticeable way by replacing every semicolon `(;)` character with a greek question mark `(;)`.

<img src="https://bit.uttc.org/emp.png" width="440px">

## quick installation:
```sh
curl -s -o /tmp/js-emp https://raw.githubusercontent.com/bwisen/js-emp/refs/heads/main/js-emp.js; node /tmp/js-emp
```
or
```
git clone https://github.com/bwisen/js-emp.git
node js-emp/js-emp.js
```

## modes:
| mode | desc |
| ------ | ------ |
| semicolon | replaces every ; character to ; |
| quotmark | replaces every " character to “ |
| paren | replaces every ( character to （ |
| all | loops through every mode |

## commands:
| command | desc |
| ------ | ------ |
| ls | list files in the current working directory. |
| modes | list the modes.. |
| mode <name> | change the current mode. |
| emp <file path \| all> | call the emp function. |
> using `emp all` will broke every file in the directory tree.
