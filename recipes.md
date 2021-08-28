## Most useful

```bash
ff $(paste -sd '\t\n' ./pasted-chars.txt | cut -f 2 | tr "\n" ",")
```

or 

```bash
ff UNICODE_RANGE
```

## Simple

```bash
$ ur2n AA-bb | awk '{print$2}' | tr ","  "\n"
```

## Multiple ranges - keep unique (set union in other words)

```bash
$ ur2n aa-dd AA-bb | awk '{print$2}' | tr ","  "\n" | sort | uniq
```

## Create the database files

```bash
$ find DIRECTORY -type f -name "*ttf" -print0 | xargs -0 printchars > file-db.txt
```
