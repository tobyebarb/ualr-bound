import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useContext,
} from "react";
import "./Table.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import SearchIcon from "../../icons/SearchIcon";
import { Context } from "../../store/appContext";
import * as constants from "../../utils/Constants";

/* {
  tableWidth,
  rowHeight,
  getData,
  getColumnDefs,
  getFrameworkComponents,
  handleResize,
} */

const Table = React.forwardRef((props, ref) => {
  //const [columnDefs, setColumnDefs] = useState([]);
  const { store, actions } = useContext(Context);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [frameworkComponents, setFrameworkComponents] = useState([]);
  //const [frameworkComponents, setFrameworkComponents] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const onSearchFocus = () => setSearchFocused(true);
  const onSearchBlur = () => setSearchFocused(false);

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  const focusedColor = "#582633";

  var data = [];

  const updateData = async () => {
    data = await props.getData();
    setRowData(data);
  };

  const onSelectionChanged = async () => {
    var selectedRows = gridApi.getSelectedRows();
    var uid = parseInt(selectedRows[0].user_id);

    let res = await actions.updateSelectedUserID(uid);
    if (props.rowSelectionCallback !== null) {
      console.log(res);
      props.rowSelectionCallback(uid);
    }
  };

  useImperativeHandle(ref, () => ({
    updateData,
  }));

  useEffect(() => {
    let initialize = async () => {
      var initFrameworkComponents = await props.getFrameworkComponents();
      var initColumnDefs = await props.getColumnDefs();

      setFrameworkComponents(initFrameworkComponents);
      setColumnDefs(initColumnDefs);

      return [initFrameworkComponents, initColumnDefs];
    };

    initialize();

    window.addEventListener("resize", props.handleResize, false);

    return () => window.removeEventListener("resize", props.handleResize);
  }, []);

  async function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    let data = await props.getData();
    setRowData(data);
  }

  return columnDefs === [] && frameworkComponents === [] ? (
    <div>Loading Data...</div>
  ) : (
    <div className="table-container">
      <div
        className="ag-theme-balham table-root"
        style={{
          height: "80vh",
          width: props.tableWidth,
        }}
      >
        <div className="table-searchbar-container">
          <SearchIcon focused={searchFocused} focusedColor={focusedColor} />
          <input
            type="search"
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            className="table-searchbar"
            onChange={onFilterTextChange}
            placeholder="Search for a request..."
          />
        </div>
        <AgGridReact
          onGridReady={onGridReady}
          rowHeight={props.rowHeight}
          frameworkComponents={frameworkComponents}
          columnDefs={columnDefs}
          rowData={rowData}
          scrollbarWidth={0}
          onSelectionChanged={onSelectionChanged}
          rowSelection={"single"}
        />
      </div>
    </div>
  );
});

export default Table;

Table.defaultProps = {
  rowSelectionCallback: null,
};
