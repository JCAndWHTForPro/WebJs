import re

matcher = re.compile("\[.*?\]")
originstr = 'asdffoooo[asd and asdf]fdas[wer]ffoo'
originlist = matcher.findall(originstr)
print str(originlist)
for string in originlist:
    newstring = string[1:(len(string) - 1)]
    print newstring
    print string
    arr_str = re.split("\s+and\s+", newstring)
    subresultstr = ""
    if len(arr_str) >= 2:
        for substr in arr_str:
            newsubstr = "[" + substr + "]"
            subresultstr += newsubstr
    print subresultstr
    if subresultstr:
        originstr = originstr.replace(string, subresultstr)
    print originstr
