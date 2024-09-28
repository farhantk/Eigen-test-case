def freq_counter(arr_input, arr_query):
    freq = []
    for word in arr_query:
        count = arr_input.count(word)
        freq.append(count)
    return freq

def freq_counter_2(arr_input, arr_query):
    freq = []
    for query in arr_query:
        count = 0
        for input in arr_input:
            if query == input:
                count += 1
        freq.append(count)
    return freq

input = ['xc', 'dz', 'bbb', 'dz']
query = ['bbb', 'ac', 'dz']
result = freq_counter_2(input, query)
print(result)