export const constantSum = (k: number = 1) => (x: number) => k-x;
export const constantProd = (k: number = 1) => (x: number) => k/x;
export const constantProdDer = (k: number = 1) => (x: number) => (k * -1)/x**2;
export const constantFunc = (k: number = 1) => (x: number) => (k-(x**2))/5;
export const constantFuncDer = (k: number = 1) => (x: number) => (2*x)/5;
export const constantSumDer = (k: number = 1) => (x: number) => k;
