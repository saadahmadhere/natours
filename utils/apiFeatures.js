class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const newQueryObject = { ...this.queryObject };
    const excluedFields = ['page', 'sort', 'limit', 'fields'];
    excluedFields.forEach((el) => delete newQueryObject[el]);
    let queryStr = JSON.stringify(newQueryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const selectFields = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(selectFields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 1;
    const skipPages = (page - 1) * limit;
    this.query = this.query.skip(skipPages).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
