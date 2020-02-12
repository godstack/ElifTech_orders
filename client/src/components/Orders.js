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
      isLoading: true
    };
  }

  fetchFunc = (pageNo, size) => {
    this.setState({ isLoading: true });
    console.log("call");
    fetch(`/api?pageNo=${pageNo}&size=${size}`)
      .then(res => res.json())
      .then(res => {
        let data = res.message;
        let pages = res.pages;
        for (let i = 0; i < data.length; i++) {
          for (let key in data[i]) {
            if (key === "date") {
              data[i][key] = new Date(data[i][key]);
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
          pageNo
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

  handleSort = (sortType, isValuesSort) => {
    let { dbData } = this.state;
    let itemToCompare = isValuesSort ? "value" : "date";

    if (sortType === 1) {
      dbData = dbData.sort((a, b) => {
        if (a[itemToCompare] < b[itemToCompare]) {
          return -1;
        }

        if (a[itemToCompare] > b[itemToCompare]) {
          return 1;
        }

        return 0;
      });
    } else if (sortType === -1) {
      dbData = dbData.sort((a, b) => {
        if (a[itemToCompare] < b[itemToCompare]) {
          return 1;
        }

        if (a[itemToCompare] > b[itemToCompare]) {
          return -1;
        }

        return 0;
      });
    }

    this.setState({ dbData });
  };

  ordersList = () => {
    const { dbData, size, pageNo, pages } = this.state;
    return (
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
                <div className="order-item">
                  {(pageNo - 1) * size + (index + 1)}
                </div>
                <div className="order-item">{entries[1][1]}</div>
                <div className="order-item">{entries[2][1].toDateString()}</div>
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
    const { isLoading, pageNo, pages, pageNoChoosen, sizeChoosen } = this.state;
    return (
      <div>
        <div className="info">
          <h1>
            Page № {pageNo} (of {pages})
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
              Sort orders by <i>VALUES</i>
            </p>

            <button onClick={() => this.handleSort(1, true)}>
              Ascending sort
            </button>
            <button onClick={() => this.handleSort(-1, true)}>
              Descending sort
            </button>
          </div>
          <div className="sorting-item">
            <p>
              Sort orders by <i>Dates</i>
            </p>

            <button onClick={() => this.handleSort(1, false)}>
              Ascending sort
            </button>
            <button onClick={() => this.handleSort(-1, false)}>
              Descending sort
            </button>
          </div>
        </div>
        {isLoading ? (
          <h1 className="loading">Loading...</h1>
        ) : (
          this.ordersList()
        )}
      </div>
    );
  }
}
