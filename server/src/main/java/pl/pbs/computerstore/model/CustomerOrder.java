package pl.pbs.computerstore.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private long orderId;
    @Column(name = "total_price", nullable = false)
    private double totalPrice;
    @CreationTimestamp
    @Column(name = "request_date", nullable = false)
    private Timestamp requestDate;
    @Column(name = "payment_date", nullable = true)
    private Timestamp paymentDate;
    @Column(name = "accept_date", nullable = true)
    private Timestamp acceptDate;
    @Enumerated(EnumType.STRING)
    private Status status;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToMany(mappedBy = "customerOrder")
    @JsonIgnoreProperties({"customerOrder"})
    private List<CustomerOrderItem> items;
    //gettery, settery i konstruktory
    public CustomerOrder(long orderId, double totalPrice, Timestamp requestDate, Timestamp acceptDate, Status status, User user, List<CustomerOrderItem> items) {
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.requestDate = requestDate;
        this.acceptDate = acceptDate;
        this.status = status;
        this.user = user;
        this.items = items;
    }

    public CustomerOrder() {
    }

    public long getOrderId() {
        return orderId;
    }

    public void setOrderId(long orderId) {
        this.orderId = orderId;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CustomerOrderItem> getCustomerOrderItems() {
        return items;
    }

    public void setCustomerOrderItems(List<CustomerOrderItem> items) {
        this.items = items;
    }

    public Timestamp getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Timestamp requestDate) {
        this.requestDate = requestDate;
    }

    public Timestamp getAcceptDate() {
        return acceptDate;
    }

    public void setAcceptDate(Timestamp acceptDate) {
        this.acceptDate = acceptDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Timestamp getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Timestamp paymentDate) {
        this.paymentDate = paymentDate;
    }
}
