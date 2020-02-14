import React, { Component } from "react";
import "../css/Orders.css";

export default class Orders extends Component {
  constructor() {
    super();
    this.state = {
      dbData: [],
      pageNo: 1,
      pageNoChoosen: null,
      size: 5,
      sizeChoosen: null,
      pages: 0,
      isLoading: true,
      totalCount: null
    };
  }

  fetchFunc = (pageNo, size) => {
    this.setState({ isLoading: true });

    fetch(`/api?pageNo=${pageNo}&size=${size}`)
      .then(res => res.json())
      .then(res => {
        let data = res.message;
        let pages = res.pages;
        let totalCount = res.totalCount;
        for (let i = 0; i < data.length; i++) {
          for (let key in data[i]) {
            if (key === "date") {
              data[i][key] = new Date(data[i][key]);
              data[i].record_number = (pageNo - 1) * size + (i + 1);
              break;
            }
          }
        }

        this.setState({
          dbData: data,
          isLoading: false,
          pages,
          pageNoChoosen: pageNo,
          sizeChoosen: size,
          size,
          pageNo,
          totalCount
        });
      });
  };

  componentDidMount = () => {
    const { pageNo, size } = this.state;

    this.fetchFunc(pageNo, size);
  };

  onChangeInput = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSizeAccept = () => {
    const { sizeChoosen, size } = this.state;

    if (sizeChoosen > 50) {
      this.setState({
        sizeChoosen: size
      });
      return alert(`Choose table size less, than 50!`);
    } else if (sizeChoosen < 1) {
      this.setState({
        sizeChoosen: size
      });
      return alert(`Choose table size greater or equal, than 1!`);
    }

    this.fetchFunc(1, sizeChoosen);
  };

  handlePageAccept = () => {
    const { pageNoChoosen, pages, pageNo, size } = this.state;

    if (pageNoChoosen > pages) {
      this.setState({ pageNoChoosen: pageNo });
      return alert(`Choose page less or equal, than ${pages}!`);
    } else if (pageNoChoosen < 1) {
      this.setState({ pageNoChoosen: pageNo });
      return alert(`Choose page greater or equal, than 1!`);
    }

    this.fetchFunc(pageNoChoosen, size);
  };

  handleSort = (sortType, WhatToSort) => {
    let { dbData } = this.state;

    if (sortType === 1) {
      dbData = dbData.sort((a, b) => {
        if (a[WhatToSort] < b[WhatToSort]) {
          return -1;
        }

        if (a[WhatToSort] > b[WhatToSort]) {
          return 1;
        }

        return 0;
      });
    } else if (sortType === -1) {
      dbData = dbData.sort((a, b) => {
        if (a[WhatToSort] < b[WhatToSort]) {
          return 1;
        }

        if (a[WhatToSort] > b[WhatToSort]) {
          return -1;
        }

        return 0;
      });
    }

    this.setState({ dbData });
  };

  ordersList = () => {
    const {
      dbData,
      pageNo,
      pages,
      pageNoChoosen,
      sizeChoosen,
      totalCount
    } = this.state;
    return (
      <div>
        <div className="info">
          <h1>
            Page № {pageNo} (of {pages}), orders amount {totalCount}
          </h1>
          <div className="choose-wrapper">
            <div className="choose-input">
              <p>Choose page:</p>
              <input
                type="number"
                name="pageNoChoosen"
                min="1"
                max={pages}
                placeholder="Page number"
                value={pageNoChoosen === null ? "1" : pageNoChoosen}
                onChange={this.onChangeInput}
              />
              <button onClick={this.handlePageAccept}>Accept</button>
            </div>

            <div className="choose-input">
              <p>Table size:</p>
              <input
                type="number"
                name="sizeChoosen"
                min="1"
                placeholder="Table size"
                value={sizeChoosen === null ? "1" : sizeChoosen}
                onChange={this.onChangeInput}
              />
              <button onClick={this.handleSizeAccept}>Accept</button>
            </div>
          </div>
        </div>
        <div className="sorting-wrapper">
          <div className="sorting-item">
            <p>
              Sort orders by <i>RECORD NUMBER</i>
            </p>

            <button onClick={() => this.handleSort(1, "record_number")}>
              Ascending sort
            </button>
            <button onClick={() => this.handleSort(-1, "record_number")}>
              Descending sort
            </button>
          </div>
          <div className="sorting-item">
            <p>
              Sort orders by <i>Dates</i>
            </p>

            <button onClick={() => this.handleSort(1, "date")}>
              Ascending sort
            </button>
            <button onClick={() => this.handleSort(-1, "date")}>
              Descending sort
            </button>
          </div>
          <div className="sorting-item">
            <p>
              Sort orders by <i>VALUES</i>
            </p>

            <button onClick={() => this.handleSort(1, "value")}>
              Ascending sort
            </button>
            <button onClick={() => this.handleSort(-1, "value")}>
              Descending sort
            </button>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="orders-wrapper">
            <div className="order-header">
              <div className="order-item">Record number</div>
              <div className="order-item">User email</div>
              <div className="order-item">Date</div>
              <div className="order-item">Value</div>
              <div className="order-item">Currency</div>
            </div>
            {dbData.map((item, index) => {
              let entries = Object.entries(item);

              return (
                <div className="order" key={index}>
                  <div className="order-item">{entries[6][1]}</div>
                  <div className="order-item">{entries[1][1]}</div>
                  <div className="order-item">
                    {entries[2][1].toDateString()}
                  </div>
                  <div className="order-item">{entries[3][1]}</div>
                  <div className="order-item">{entries[4][1]}</div>
                </div>
              );
            })}
          </div>
          <div className="nav-buttons">
            {pageNo <= 1 ? (
              ""
            ) : (
              <button onClick={() => this.handlePageChangeClick(false)}>
                Previous page
              </button>
            )}
            {pageNo === pages ? (
              ""
            ) : (
              <button onClick={() => this.handlePageChangeClick(true)}>
                Next page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  handlePageChangeClick = boolNext => {
    let { pageNo, size } = this.state;

    if (boolNext) {
      pageNo++;
    } else {
      pageNo--;
    }

    this.fetchFunc(pageNo, size);
  };

  render() {
    const { isLoading, dbData } = this.state;
    console.log(dbData);
    return (
      <div>
        {isLoading ? (
          <h1 className="loading">Loading...</h1>
        ) : dbData.length === 0 ? (
          <h1 className="loading">Upload some files first</h1>
        ) : (
          this.ordersList()
        )}
      </div>
    );
  }
}
