'use client';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test4')({
  component: Test,

  loader: ({ context }) => {
    return { user: context.user };
  },
});

const settings = {
  fileName: 'MySpreadsheet', // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
};

const callback = function (sheet) {
  console.log('Download complete:', sheet);
};

async function exportData(data) {
  try {
    const jsonAsXlsx = await import('json-as-xlsx');
    jsonAsXlsx.default(data, settings, callback);
  } catch (error) {
    console.error('Failed to load json-as-xlsx', error);
  }
}

async function Test() {
  const data = [
    {
      sheet: 'Adults',
      columns: [
        { label: 'User', value: 'user' }, // Top level data
        { label: 'Age', value: (row) => row.age + ' years' }, // Custom format
        { label: 'Phone', value: (row) => (row.more ? row.more.phone || '' : '') }, // Run functions
      ],
      content: [
        { user: 'Andrea', age: 20, more: { phone: '11111111' } },
        { user: 'Luis', age: 21, more: { phone: '12345678' } },
      ],
    },
    {
      sheet: 'Children',
      columns: [
        { label: 'User', value: 'user' }, // Top level data
        { label: 'Age', value: 'age', format: '# "years"' }, // Column format
        { label: 'Phone', value: 'more.phone', format: '(###) ###-####' }, // Deep props and column format
      ],
      content: [
        { user: 'Manuel', age: 16, more: { phone: 9999999900 } },
        { user: 'Ana', age: 17, more: { phone: 8765432135 } },
      ],
    },
  ];

  await exportData(data);
  return (
    <div>
      <h1>Testxlsx</h1>
    </div>
  );
}
