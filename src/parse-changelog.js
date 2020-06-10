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
 * @returns {boolean}
 */
const changelogIsEmpty = (changelogContent) => !Boolean(changelogContent.trim());

/**
 * @param {string} changelogContent
 * @return {boolean}
 */
const changelogMissesVersionHeadline = (changelogContent) => {
  const content = '\n' + changelogContent;
  const newLineAndNewVersionString = '\n' + LINE_START_FOR_NEW_VERSION;
  return !content.includes(newLineAndNewVersionString)
}

/**
 * @param {string} changelogContent
 * @returns {import("./parse-changelog").TodoItems}
 */
export const parseChangelog = (changelogContent) => {
  if (changelogIsEmpty(changelogContent)) {
    return { version: '-1', items: [] };
  }

  if (changelogMissesVersionHeadline(changelogContent)) {
    return { version: '-1', items: [] };
  }

  const content = '\n' + changelogContent;
  const newLineAndNewVersionString = '\n' + LINE_START_FOR_NEW_VERSION;
  const versions = content.split(newLineAndNewVersionString);
  const firstVersionParagraph = versions[1];
  const version = firstVersionParagraph.split('\n')[0];
  return { version, items: todoItems(firstVersionParagraph) };
};
