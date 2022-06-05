type construcs =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | ObjectConstructor
  | ArrayConstructor;

export function pluck<
  O extends { [K: string]: any },
  V extends { [Property in keyof O]?: construcs }
>(validation: V, obj: O): { [Property in keyof V]: ReturnType<V[Property]> } {
  const res: any = {};

  for (const [key, construc] of Object.entries(validation)) {
    res[key] = new construc(obj[key]);
  }

  return res;
}
