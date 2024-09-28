def reverse(string):
    alphabet, number = '', ''
    for char in string:
        if char.isalpha():
            alphabet += char
        else:
            number += char

    reverse_string = alphabet[::-1]
    result = reverse_string + number

    return result

input = "NEGIE1"
result = reverse(input)
print(result)