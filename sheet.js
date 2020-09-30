const { GoogleSpreadsheet } = require("google-spreadsheet");

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet(
      "1t6KH5umJEQ6dqQoOTXdC5bM0vBjnDB2NiJ6Y06o_Yqs"
    );
  }
  async load() {
    // load directly from json file if not in secure environment
    await this.doc.useServiceAccountAuth(require("./credentials.json"));
    // loads document properties and worksheets
    await this.doc.loadInfo();
  }
  async addRows(rows, i) {
    // or use doc.sheetsById[id]
    const sheet = this.doc.sheetsByIndex[i];
    await sheet.addRows(rows);
  }
  async getRows(i) {
    const sheet = this.doc.sheetsByIndex[i];
    const rows = await sheet.getRows();
    return rows;
  }
};
