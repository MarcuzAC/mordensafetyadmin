import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { transactionsAPI, expensesAPI } from '../services/api';

const Revenue = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenueData, setRevenueData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    period: 'month',
    start_date: '',
    end_date: '',
    type: '',
    page: 1,
    limit: 20
  });
  const [expenseFilters, setExpenseFilters] = useState({
    category: '',
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchRevenueData();
    fetchTransactions();
    fetchExpenses();
  }, [filters.period, filters.page, expenseFilters.page]);

  const fetchRevenueData = async () => {
    try {
      const response = await transactionsAPI.getRevenueSummary(filters.period);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getAllTransactions(filters);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await expensesAPI.getAllExpenses(expenseFilters);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const deleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesAPI.deleteExpense(expenseId);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense');
      }
    }
  };

  const handlePeriodChange = (period) => {
    setFilters({ ...filters, period });
  };

  // Add this function to clear all filters
  const clearExpenseFilters = () => {
    setExpenseFilters({
      category: '',
      status: '',
      start_date: '',
      end_date: '',
      page: 1,
      limit: 20
    });
  };

  if (loading && !revenueData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ color: '#1e3c72' }}>Loading revenue data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#1e3c72',
            fontSize: '28px',
            fontWeight: '700'
          }}>Revenue & Expenses</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>Track financial performance and manage expenses</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e1e8ed',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setActiveTab('revenue')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'revenue' ? '2px solid #1e3c72' : 'none',
            color: activeTab === 'revenue' ? '#1e3c72' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          Revenue Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'transactions' ? '2px solid #1e3c72' : 'none',
            color: activeTab === 'transactions' ? '#1e3c72' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'expenses' ? '2px solid #1e3c72' : 'none',
            color: activeTab === 'expenses' ? '#1e3c72' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          Expenses
        </button>
        {activeTab === 'expenses' && (
          <button
            onClick={() => setShowExpenseModal(true)}
            style={{
              marginLeft: 'auto',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ➕ Add Expense
          </button>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'revenue' && (
        <RevenueDashboard
          revenueData={revenueData}
          onPeriodChange={handlePeriodChange}
          currentPeriod={filters.period}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsTable
          transactions={transactions}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesTable
          expenses={expenses}
          onEdit={setEditingExpense}
          onDelete={deleteExpense}
          filters={expenseFilters}
          setFilters={setExpenseFilters}
          clearFilters={clearExpenseFilters}
        />
      )}

      {/* Expense Modal */}
      {(showExpenseModal || editingExpense) && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
          }}
          onSave={() => {
            fetchExpenses();
            setShowExpenseModal(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
};

// Revenue Dashboard Component
const RevenueDashboard = ({ revenueData, onPeriodChange, currentPeriod }) => {
  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
  };

  return (
    <div>
      {/* Period Selector */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {['day', 'week', 'month', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => onPeriodChange(period)}
            style={{
              padding: '10px 20px',
              background: currentPeriod === period 
                ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                : 'white',
              color: currentPeriod === period ? 'white' : '#64748b',
              border: currentPeriod === period ? 'none' : '1px solid #e1e8ed',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {periodLabels[period]}
          </button>
        ))}
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <FinancialCard
          title="Total Revenue"
          value={`MK ${revenueData?.total_revenue?.toLocaleString() || '0'}`}
          change="+12%"
          color="#10b981"
          icon="💰"
        />
        <FinancialCard
          title="Order Revenue"
          value={`MK ${revenueData?.order_revenue?.toLocaleString() || '0'}`}
          change="+8%"
          color="#3b82f6"
          icon="📦"
        />
        <FinancialCard
          title="Service Revenue"
          value={`MK ${revenueData?.service_revenue?.toLocaleString() || '0'}`}
          change="+15%"
          color="#8b5cf6"
          icon="🔧"
        />
        <FinancialCard
          title="Total Expenses"
          value={`MK ${revenueData?.total_expenses?.toLocaleString() || '0'}`}
          change="-5%"
          color="#ef4444"
          icon="📉"
        />
      </div>

      {/* Profit Summary */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e8ed',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          margin: '0 0 25px 0',
          color: '#1e3c72',
          fontSize: '20px',
          fontWeight: '600'
        }}>Profit Summary</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '10px',
              fontWeight: '500'
            }}>
              Net Profit
            </div>
            <div style={{
              fontSize: '32px',
              color: '#10b981',
              fontWeight: '700',
              marginBottom: '5px'
            }}>
              MK {revenueData?.net_profit?.toLocaleString() || '0'}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#64748b'
            }}>
              {periodLabels[currentPeriod]}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '10px',
              fontWeight: '500'
            }}>
              Profit Margin
            </div>
            <div style={{
              fontSize: '32px',
              color: '#8b5cf6',
              fontWeight: '700',
              marginBottom: '5px'
            }}>
              {revenueData?.total_revenue ? 
                `${((revenueData.net_profit / revenueData.total_revenue) * 100).toFixed(1)}%` : 
                '0%'
              }
            </div>
            <div style={{
              fontSize: '14px',
              color: '#64748b'
            }}>
              of total revenue
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Counts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <CountCard
          title="Orders"
          value={revenueData?.order_count || 0}
          icon="📦"
          color="#3b82f6"
        />
        <CountCard
          title="Services"
          value={revenueData?.service_count || 0}
          icon="🔧"
          color="#8b5cf6"
        />
        <CountCard
          title="Expenses"
          value={revenueData?.expense_count || 0}
          icon="📋"
          color="#ef4444"
        />
        <CountCard
          title="Avg Order"
          value={`MK ${revenueData?.order_count ? 
            Math.round(revenueData.order_revenue / revenueData.order_count) : 
            '0'
          }`}
          icon="📊"
          color="#10b981"
        />
      </div>
    </div>
  );
};

// Financial Card Component
const FinancialCard = ({ title, value, change, color, icon }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e1e8ed',
    padding: '25px',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '24px',
        color: color
      }}>
        {icon}
      </div>
    </div>
    <div style={{
      fontSize: '28px',
      color: '#1e3c72',
      fontWeight: '700',
      marginBottom: '8px'
    }}>
      {value}
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: change?.startsWith('+') ? '#10b981' : '#ef4444',
      fontWeight: '500'
    }}>
      {change && (
        <>
          <span>{change}</span>
          <span>from last period</span>
        </>
      )}
    </div>
  </div>
);

// Count Card Component
const CountCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e1e8ed',
    padding: '20px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '10px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: color
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          fontWeight: '500',
          marginBottom: '5px'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '24px',
          color: '#1e3c72',
          fontWeight: '700'
        }}>
          {value}
        </div>
      </div>
    </div>
  </div>
);

// Transactions Table Component
const TransactionsTable = ({ transactions, filters, setFilters }) => {
  const getTypeColor = (type) => {
    switch(type) {
      case 'order_payment': return '#10b981';
      case 'service_payment': return '#3b82f6';
      case 'expense': return '#ef4444';
      case 'refund': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e1e8ed',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e1e8ed'
      }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#1e3c72',
          fontSize: '16px',
          fontWeight: '600'
        }}>Transaction History</h4>
        
        {/* Transaction Filters */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '15px'
        }}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            style={{
              padding: '8px 12px',
              border: '1px solid #e1e8ed',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">All Types</option>
            <option value="order_payment">Order Payments</option>
            <option value="service_payment">Service Payments</option>
            <option value="expense">Expenses</option>
            <option value="refund">Refunds</option>
          </select>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({...filters, start_date: e.target.value})}
            style={{
              padding: '8px 12px',
              border: '1px solid #e1e8ed',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({...filters, end_date: e.target.value})}
            style={{
              padding: '8px 12px',
              border: '1px solid #e1e8ed',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            placeholder="End Date"
          />
        </div>
      </div>

      {transactions.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: '0.5'
          }}>💰</div>
          <h3 style={{
            margin: '0 0 8px 0',
            color: '#1e3c72'
          }}>No Transactions Found</h3>
          <p style={{
            margin: '0',
            color: '#64748b'
          }}>No transactions match your current filters</p>
        </div>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e1e8ed'
            }}>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Transaction #</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Type</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Description</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Client</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Amount (MK)</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600'
              }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{
                borderBottom: '1px solid #e1e8ed'
              }}>
                <td style={{
                  padding: '16px 20px',
                  color: '#1e3c72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {transaction.transaction_number}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: `${getTypeColor(transaction.type)}20`,
                    color: getTypeColor(transaction.type),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: getTypeColor(transaction.type),
                      marginRight: '6px'
                    }} />
                    {formatType(transaction.type)}
                  </div>
                </td>
                <td style={{
                  padding: '16px 20px',
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  {transaction.description}
                </td>
                <td style={{
                  padding: '16px 20px',
                  color: '#1e3c72',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {transaction.client_name || 'System'}
                </td>
                <td style={{
                  padding: '16px 20px',
                  color: transaction.type === 'expense' ? '#ef4444' : '#10b981',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {transaction.type === 'expense' ? '-' : '+'} MK {transaction.amount?.toLocaleString()}
                </td>
                <td style={{
                  padding: '16px 20px',
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  {formatDate(transaction.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Expenses Table Component
const ExpensesTable = ({ expenses, onEdit, onDelete, filters, setFilters, clearFilters }) => {
  const getCategoryColor = (category) => {
    const colors = {
      office_supplies: '#3b82f6',
      transportation: '#f59e0b',
      utilities: '#10b981',
      salaries: '#8b5cf6',
      maintenance: '#ef4444',
      marketing: '#ec4899',
      rent: '#14b8a6',
      equipment: '#6366f1',
      other: '#64748b'
    };
    return colors[category] || '#64748b';
  };

  const formatCategory = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Expense Filters */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '25px'
      }}>
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          style={{
            padding: '10px 15px',
            border: '1px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="">All Categories</option>
          <option value="office_supplies">Office Supplies</option>
          <option value="transportation">Transportation</option>
          <option value="utilities">Utilities</option>
          <option value="salaries">Salaries</option>
          <option value="maintenance">Maintenance</option>
          <option value="marketing">Marketing</option>
          <option value="rent">Rent</option>
          <option value="equipment">Equipment</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          style={{
            padding: '10px 15px',
            border: '1px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={filters.start_date}
          onChange={(e) => setFilters({...filters, start_date: e.target.value})}
          style={{
            padding: '10px 15px',
            border: '1px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px'
          }}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.end_date}
          onChange={(e) => setFilters({...filters, end_date: e.target.value})}
          style={{
            padding: '10px 15px',
            border: '1px solid #e1e8ed',
            borderRadius: '6px',
            fontSize: '14px'
          }}
          placeholder="End Date"
        />
        <button
          onClick={clearFilters}
          style={{
            padding: '10px 20px',
            border: '1px solid #e1e8ed',
            borderRadius: '6px',
            background: 'white',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Expenses List */}
      <div style={{
        display: 'grid',
        gap: '20px'
      }}>
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            getCategoryColor={getCategoryColor}
            formatCategory={formatCategory}
            formatDate={formatDate}
          />
        ))}

        {expenses.length === 0 && (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: '0.5'
            }}>📋</div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#1e3c72'
            }}>No Expenses Found</h3>
            <p style={{
              margin: '0',
              color: '#64748b'
            }}>No expenses match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Expense Card Component
const ExpenseCard = ({ expense, onEdit, onDelete, getCategoryColor, formatCategory, formatDate }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e1e8ed',
    padding: '25px',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: `${getCategoryColor(expense.category)}20`,
            color: getCategoryColor(expense.category),
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {formatCategory(expense.category)}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: expense.status === 'approved' ? '#10b98120' : 
                      expense.status === 'pending' ? '#f59e0b20' : '#ef444420',
            color: expense.status === 'approved' ? '#10b981' : 
                  expense.status === 'pending' ? '#f59e0b' : '#ef4444',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
          </div>
        </div>
        <div style={{
          fontSize: '18px',
          color: '#1e3c72',
          fontWeight: '600',
          marginBottom: '5px'
        }}>
          {expense.expense_number}
        </div>
        <div style={{
          color: '#64748b',
          fontSize: '14px'
        }}>
          {expense.description}
        </div>
      </div>
      <div>
        <div style={{
          fontSize: '24px',
          color: '#ef4444',
          fontWeight: '700',
          marginBottom: '5px'
        }}>
          MK {expense.amount?.toLocaleString()}
        </div>
        <div style={{
          color: '#64748b',
          fontSize: '13px'
        }}>
          {formatDate(expense.created_at)}
        </div>
      </div>
    </div>
    
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #e1e8ed',
      paddingTop: '15px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {expense.receipt_image && (
          <a
            href={`http://localhost:8000${expense.receipt_image}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📄 View Receipt
          </a>
        )}
      </div>
      <div style={{
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => onEdit(expense)}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// Expense Modal Component
const ExpenseModal = ({ expense, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: expense?.category || 'office_supplies',
    amount: expense?.amount || '',
    description: expense?.description || '',
    status: expense?.status || 'pending',
    receipt_image: expense?.receipt_image || null
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      
      if (receiptFile) {
        formDataToSend.append('receipt_image', receiptFile);
      } else if (formData.receipt_image) {
        formDataToSend.append('receipt_image', formData.receipt_image);
      }

      if (expense) {
        await api.put(`/api/expenses/${expense.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/expenses', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h3 style={{
            margin: 0,
            color: '#1e3c72',
            fontSize: '20px'
          }}>
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="office_supplies">Office Supplies</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="salaries">Salaries</option>
                <option value="maintenance">Maintenance</option>
                <option value="marketing">Marketing</option>
                <option value="rent">Rent</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Amount (MK)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Enter expense description"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Receipt Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  fontSize: '14px'
                }}
              />
              {formData.receipt_image && !receiptFile && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Current: {formData.receipt_image.split('/').pop()}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '30px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #e1e8ed',
                borderRadius: '6px',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: loading 
                  ? '#cbd5e1' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Revenue;