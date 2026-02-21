import { getBookings, getExpertById } from '@/lib/expert-db';

export default function AdminBookingsPage() {
  const bookings = getBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(180, 83, 9, 0.1)', text: 'rgb(180, 83, 9)' }; // amber
      case 'confirmed':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' }; // green
      case 'cancelled':
        return { bg: 'rgba(220, 38, 38, 0.1)', text: 'rgb(220, 38, 38)' }; // red
      case 'completed':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' }; // blue
      case 'in-progress':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' }; // blue
      default:
        return { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Bookings</h1>
          <p className="text-secondary mt-2">Manage expert consultation bookings</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '20px 24px'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0
          }}>
            Total Bookings: {bookings.length}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-body)'
          }}>
            <p>No bookings yet. When experts are booked, they will appear here.</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Client</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Email</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Expert</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Date & Time</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Status</th>
                <th style={{
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Amount</th>
                <th style={{
                  textAlign: 'right',
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border-primary)' }}>
              {bookings.map((booking, index) => {
                const expert = getExpertById(booking.expertId);
                const statusColor = getStatusColor(booking.status);

                return (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: index < bookings.length - 1 ? '1px solid var(--border-primary)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {booking.clientName}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      maxWidth: '180px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {booking.clientEmail}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {expert ? expert.name : 'Unknown Expert'}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} {booking.startTime}
                    </td>
                    <td style={{
                      padding: '16px 24px'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: '11px',
                        borderRadius: '9999px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-body)',
                        textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500
                    }}>
                      ${booking.totalAmount.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'right'
                    }}>
                      <button
                        style={{
                          color: 'var(--teal)',
                          fontSize: '13px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'text-decoration 0.2s',
                          fontFamily: 'var(--font-body)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
