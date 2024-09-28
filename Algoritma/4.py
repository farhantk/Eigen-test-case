def counter(matrix):
    N = len(matrix)
    num_1 = 0
    num_2 = 0
    for i in range(N):
        num_1 += matrix[i][i]
        num_2 += matrix[i][-1*(i+1)]

    return num_1-num_2


matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
result = counter(matrix)
print(result)