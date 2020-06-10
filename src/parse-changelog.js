export const LINE_START_FOR_NEW_VERSION = '# version ';
export const LINE_START_FOR_TODO = '- [ ]';

/**
 * @param {string} content
 * @returns {string[]}
 */
const todoItems = (content) => {
  /**
   * @param {string} line
   * @returns {string}
   */
  const todoItem = (line) => {
    const startsAt = line.indexOf(LINE_START_FOR_TODO) + LINE_START_FOR_TODO.length + 1;
    return line.substr(startsAt);
  };
  return content
    .split('\n')
    .filter(line => line.trim().startsWith(LINE_START_FOR_TODO))
    .map(todoItem)
  ;
};

/**
 * @param {string} changelogContent
 * @returns {import("./parse-changelog").TodoItems}
 */
export const parseChangelog = (changelogContent) => {
  const changelogIsEmpty = !Boolean(changelogContent.trim());
  if (changelogIsEmpty) {
    return { version: '-1', items: [] };
  }

  const changelogContainsNoVersionHeadline = () => {
    const content = '\n' + changelogContent;
    const newLineAndNewVersionString = '\n' + LINE_START_FOR_NEW_VERSION;
    return !content.includes(newLineAndNewVersionString)
  }
  if (changelogContainsNoVersionHeadline()) {
    return { version: '-1', items: [] };
  }

  const content = '\n' + changelogContent;
  const newLineAndNewVersionString = '\n' + LINE_START_FOR_NEW_VERSION;
  const versions = content.split(newLineAndNewVersionString);
  const firstVersionParagraph = versions[1];
  const version = firstVersionParagraph.split('\n')[0];
  return { version, items: todoItems(firstVersionParagraph) };
};
