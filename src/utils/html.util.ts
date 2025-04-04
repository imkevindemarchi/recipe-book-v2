export function setPageTitle(partialTitle: string): void {
  document.title = `${process.env.REACT_APP_WEBSITE_NAME} - ${partialTitle}`;
}
