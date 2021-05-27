from sys import platform
# define o tipo de barra que será usada a depender do sistema operacional
def type_slash():
    if platform == "linux" or platform == "linux2":
        return "/" 
    else:
        return "\\"