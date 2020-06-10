import * as assert from 'assert';
import { parseChangelog } from './parse-changelog.js';

const echo = console.log;
const echo1 = s => echo('  ' + s);
const echo2 = s => echo1('  ' + s);

echo('Parse a CHANGELOG.md');
  echo1('WHEN empty THEN return no info');
  {
    const empty = '';
    assert.deepEqual(parseChangelog(empty), { version: -1, items: [] });
  }
  echo1('WHEN spaces only THEN return no info');
  {
    const empty = '   \n    ';
    assert.deepEqual(parseChangelog(empty), { version: -1, items: [] });
  }
  echo1('WHEN it contains one "version line"')
    echo2('AND no items THEN return the version, no items');
    {
      const empty = '# version 42';
      assert.deepEqual(parseChangelog(empty), { version: 42, items: [] });
    }
    echo2('AND one item THEN return the version, and one item')
    {
      const empty = '# version 1\n- [ ] one item';
      assert.deepEqual(parseChangelog(empty), { version: 1, items: ['one item'] });
    }
    echo2('AND many items THEN return the version, and the items');
    {
      const empty = '# version 2\n- [ ] one item\n- [ ] two items\n- [ ] three items';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: ['one item', 'two items', 'three items'] });
    }
    echo2('AND many items THEN return the version, and only the todo-items');
    {
      const empty = '# version 2\n- [ ] one item\n- [x] two items\n- [ ] three items';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: ['one item', 'three items'] });
    }
    echo2('AND items, surrounded by lots of empty lines (as a markdown files them might contain)');
    {
      const empty = '\n\n# version 2\n\n- [ ] one item\n- [ ] two items\n- [ ] three items\n\n';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: ['one item', 'two items', 'three items'] });
    }
    echo2('AND items with different indentations THEN return the todo-items');
    {
      const lines = [
        '# version 1',
        '- [ ] to do',
        '  - [ ] indented to do',
      ];
      const parsed = parseChangelog(lines.join('\n'));
      assert.deepEqual(parsed, { version: 1, items: ['to do', 'indented to do'] });
    }
    echo2('AND a todo item contains the headline string THEN ignore it and still return the item (used to be broken)');
    {
      const lines = [
        '# version 1',
        '- [ ] `# version 1` broke before',
      ];
      const parsed = parseChangelog(lines.join('\n'));
      assert.deepEqual(parsed.items, ['`# version 1` broke before']);
    }
  echo1('WHEN it contains multiple "version lines"');
    echo2('AND items THEN return only the first version found');
    {
      const empty = '# version 2\n- [ ] one item\n'+
                    '# version 1\n- [ ] 2nd item';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: ['one item'] });
    }
    echo2('AND no items THEN return only the first version');
    {
      const empty = '# version 2\n- [x] one item\n'+
                    '# version 1\n- [ ] 2nd item';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: [] });
    }
    echo2('AND many items are to do THEN return only the first version and it`s todos');
    {
      const empty = '# version 2\n- [ ] 1st item\n- [x] one item\n'+
                    '# version 1\n- [ ] 2nd item';
      assert.deepEqual(parseChangelog(empty), { version: 2, items: ['1st item'] });
    }
  echo1('WHEN no version line is found');
    echo2('THEN return no info');
    {
      const invalidVersion = '# v1';
      assert.deepEqual(parseChangelog(invalidVersion), { version: -1, items: [] });
    }
