export function sortArray(array: any[], propLabel: string): any[] {
  return array.sort((a: any, b: any) => {
    return a[propLabel]?.localeCompare(b[propLabel]);
  });
}
