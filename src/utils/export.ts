import xlsx, { IJsonSheet } from "json-as-xlsx";
import { formatDate } from "./dateAndTime";
import { TimeStamp } from "@/types/types";

export function downloadToExcel(payment: boolean) {
  let columns: IJsonSheet[] = [
    {
      sheet: payment ? "Payments Table" : "Contracts Table",
      columns: [
        { label: "ID", value: "id" }, // Top level data
        { label: "PROJECT NAME", value: "project_name" },
        { label: "CONTRACTOR NAME", value: "contractor_name" },
        { label: "STAGE", value: "stage_name" },
        { label: "BANK NAME", value: "bank_name" },
        {
          label: "CONTRACT?",
          value: (row) => (row.is_contract ? "Yes" : "No"),
        },
        { label: "CONTRACT CODE", value: (row) => row.contract_code ?? "--" },
        { label: "DATE", value: (row) => formatDate(row.date as TimeStamp) },
        { label: "DESCRIPTION", value: "description" },
        {
          label: "CURRENCY NAME",
          value: "currency_name",
        },
        {
          label: "CURRENCY CODE",
          value: "currency_code",
        },
        {
          label: "CURRENCY SYMBOL",
          value: "currency_symbol",
        },
        {
          label: "CURRENCY AMOUNT",
          value: "currency_amount",
        },
        {
          label: "STATUS",
          value: (row) =>
            row.is_complete && payment
              ? "Paid"
              : !row.is_complete && payment
              ? "Pending"
              : row.is_complete && !payment
              ? "Completed"
              : "Ongoing",
        },
        {
          label: "COMMENT",
          value: (row) => ( row.comment ?? ""),
        },
      ],
      content: [
        { user: "Andrea", age: 20, more: { phone: "11111111" } },
        { user: "Luis", age: 21, more: { phone: "12345678" } },
      ],
    },
    {
      sheet: "Children",
      columns: [
        { label: "User", value: "user" }, // Top level data
        { label: "Age", value: "age", format: '# "years"' }, // Column format
        { label: "Phone", value: "more.phone", format: "(###) ###-####" }, // Deep props and column format
      ],
      content: [
        { user: "Manuel", age: 16, more: { phone: 9999999900 } },
        { user: "Ana", age: 17, more: { phone: 8765432135 } },
      ],
    },
  ];

  let settings = {
    fileName: "MySpreadsheet", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: true, // Display the columns from right-to-left (the default value is false)
  };

  xlsx(columns, settings);
}
