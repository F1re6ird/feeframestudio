export const divFilter = (inputList: string[], inputText: string) => {
    if (inputList.length === 0) {
        return true
    }
    else if (inputList.length === 3) {
        return false
    }
    else if (inputList.includes(inputText)) {
        return false
    }
    else {
        return true
    }
}