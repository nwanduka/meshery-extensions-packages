import React, { useState } from 'react';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  StyledTable,
  StyledTableContainer,
  StyledTableWrapper,
  TD,
  TH,
  TableBody,
  TableHeader,
  TableRow,
} from '../../reusecore/Table';

const TableComponent = ({
  data,
  columns,
  loading,
  noData,
  setOption,
  option,
}) => {
  return (
    <Table
      {...{ data, columns }}
      loading={loading}
      noData={noData}
      setOption={setOption}
      option={option}
    />
  );
};

function Table({ data, columns, loading, noData, setOption, option }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const options = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quaterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'All time', value: 'all' },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  const StyledButton = styled.button`
    border: 1px solid;
    border-radius: 2px;
    padding: 4px;
    font-size: 12px;
    text-transform: capitalize;
    cursor: pointer;
    ${props =>
      props.disabled
        ? `
      background-color: #ccc;
      opacity: 0.6;
      cursor: not-allowed;
    `
        : `
      background-color: #00B39F;
      color: #fff;
    `}
  `;

  const PaginationButton = ({
    loading,
    children,
    disabled,
    className,
    onClick,
  }) => {
    return (
      <StyledButton
        className={className}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {children}
      </StyledButton>
    );
  };

  const PaginationContainer = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 20px 0;
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .page-btn-container {
        margin-bottom: 0;
      }
      .page-selector {
        display: flex;
        align-items: center;
      }
    }
    .page-section {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      margin-left: 20px;
    }
    input {
      border: 1px solid gray;
      padding: 4px;
      border-radius: 2px;
      width: 64px;
    }
    select {
      border: 1px solid gray;
      padding: 4px;
      border-radius: 2px;
      width: 64px;
    }

    @media only screen and (max-width: 768px) {
      .main {
        flex-direction: column;
        .page-btn-container {
          margin-bottom: 12px;
        }
      }
    }
  `;

  return (
    <>
      <StyledTableContainer>
        <div className="filters">
          <div className="toggle-container">
            <span>Filter By</span>
            <select
              className="toggle-period"
              value={option}
              onChange={e => {
                setOption(e.target?.value);
              }}
            >
              {options?.map(metric => (
                <option
                  className="text-xs"
                  key={metric?.label}
                  value={metric?.value}
                >
                  {metric?.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <input
              type="search"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={event => setGlobalFilter(event.target.value)}
            />
          </div>
        </div>
        <StyledTableWrapper>
          <StyledTable>
            <TableHeader>
              {table?.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TH key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </TH>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!loading &&
                table?.getRowModel()?.rows.map(row => {
                  return (
                    <TableRow key={row.id} id={row?.id}>
                      {row?.getVisibleCells().map(cell => {
                        return (
                          <TD key={cell.id}>
                            <div>
                              {flexRender(
                                cell?.column.columnDef.cell,
                                cell?.getContext()
                              )}
                            </div>
                          </TD>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </StyledTable>
          {loading && (
            <section className="h-64 w-full flex items-center justify-center">
              <section>Loading...</section>
            </section>
          )}
          {!loading && data?.length === 0 && (
            <section className="h-64 w-full flex items-center justify-center">
              <p className="text-gray-400">
                {noData || 'Oops! No Data to Display'}
              </p>
            </section>
          )}
        </StyledTableWrapper>
      </StyledTableContainer>
      <div className="h-2" />
      {!loading && data?.length > 0 && (
        <PaginationContainer>
          <div className="main">
            <div className="page-btn-container">
              <PaginationButton
                className=""
                onClick={() => table?.setPageIndex(0)}
                disabled={!table?.getCanPreviousPage()}
                loading={false}
              >
                {'<<'}
              </PaginationButton>
              <PaginationButton
                onClick={() => table?.previousPage()}
                disabled={!table?.getCanPreviousPage()}
                loading={false}
              >
                &larr; Prev
              </PaginationButton>
              <PaginationButton
                onClick={() => table?.nextPage()}
                disabled={!table?.getCanNextPage()}
                loading={false}
              >
                Next &rarr;
              </PaginationButton>
              <PaginationButton
                onClick={() => table?.setPageIndex(table?.getPageCount() - 1)}
                disabled={!table?.getCanNextPage()}
                loading={false}
              >
                {'>>'}
              </PaginationButton>
            </div>
            <div className="page-selector">
              <span className="page-section">
                <div>Page</div>
                <strong>
                  {table?.getState().pagination.pageIndex + 1} of{' '}
                  {table?.getPageCount()}
                </strong>
                | Go to page:
                <input
                  type="number"
                  defaultValue={table?.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                />
              </span>
              <select
                value={table?.getState().pagination.pageSize}
                onChange={e => {
                  table?.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option className="text-xs" key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </PaginationContainer>
      )}
    </>
  );
}

export default TableComponent;