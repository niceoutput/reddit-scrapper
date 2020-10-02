const { GoogleSpreadsheet } = require("google-spreadsheet");

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet(
      "1pU_htJ5isvcjqynuyMnUhnJ4pkULNgcygiQzlAC6VMU"
    );
  }
  async load() {
    // load directly from json file if not in secure environment
    await this.doc.useServiceAccountAuth(require("./credentials.json"));
    // loads document properties and worksheets
    await this.doc.loadInfo();
  }
  async addSheet(title, headerValues) {
    await this.doc.addSheet({ title, headerValues });
    return this.doc.sheetsByIndex.length - 1;
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
