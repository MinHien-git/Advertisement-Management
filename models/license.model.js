module.exports = class License {
  constructor(
    advertisement_content,
    company_name,
    company_contact,
    start_date,
    end_date
  ) {
    this.content = advertisement_content;
    this.company_name = company_name;
    this.company_contact = company_contact;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
