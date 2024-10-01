def check_top(data, current, order):
    if current < order * 2 + 1:
        return False
    check = current - order
    check_price = data[check]
    for i in range(1, order + 1):
        if data[check + i] > check_price or data[check - i] > check_price:
            return False
    return True

def check_bottom(data, current, order) -> bool:
    if current < order * 2 + 1:
        return False
    check = current - order
    check_price = data[check]
    for i in range(1, order + 1):
        if data[check + i] < check_price or data[check - i] < check_price:
            return False
    return True
















