def longest_word(string):
    sentence = string.split()
    longest = ""
    for word in sentence:
        if len(word) > len(longest):
            longest = word

    return longest

string = "Saya sangat senang mengerjakan soal algoritma"
result = longest_word(string)
print(result, ": ", len(result), "character")