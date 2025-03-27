package pl.pbs.computerstore.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.Status;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.service.CustomerOrderItemService;
import pl.pbs.computerstore.service.CustomerOrderService;
import pl.pbs.computerstore.service.MailService;
import pl.pbs.computerstore.service.UserService;

import java.net.URI;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
public class CustomerOrderController {
    private CustomerOrderService customerOrderService;
    private CustomerOrderItemService customerOrderItemService;
    private UserService userService;
    private MailService mailService;
    public CustomerOrderController(CustomerOrderService customerOrderService, UserService userService, MailService mailService,
                                   CustomerOrderItemService customerOrderItemService) {
        this.customerOrderService = customerOrderService;
        this.userService = userService;
        this.mailService = mailService;
        this.customerOrderItemService = customerOrderItemService;
    }
    @GetMapping("/{orderId}")
    ResponseEntity<CustomerOrder> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.of(customerOrderService.getCustomerOrder(orderId));
    }
    @PostMapping
    ResponseEntity<Map<String, Long>> createCustomerOrder(@Valid @RequestBody CustomerOrder customerOrder) {
        CustomerOrder createdCustomerOrder = customerOrderService.setCustomerOrder(customerOrder);
        Map<String, Long> responseBody = Collections.singletonMap("orderId", createdCustomerOrder.getOrderId());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{orderId}").buildAndExpand(createdCustomerOrder.getOrderId()).toUri();
        return ResponseEntity.created(location).body(responseBody);//build();
    }
    @PutMapping("/finalize/{orderId}")
    public ResponseEntity<Void> finalizeCustomerOrder(@Valid @RequestBody CustomerOrder customerOrder,
                                            @PathVariable Long orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(isAdmin) {
            CustomerOrder oldOrder =  customerOrderService.getCustomerOrder(orderId).orElseThrow();
            customerOrder.setOrderId(oldOrder.getOrderId());
            customerOrder.setUser(oldOrder.getUser());
            customerOrder.setRequestDate(oldOrder.getRequestDate());
            customerOrder.setPaymentDate(oldOrder.getPaymentDate());
            customerOrder.setTotalPrice(oldOrder.getTotalPrice());
            customerOrder.setAcceptDate(Timestamp.valueOf(LocalDateTime.now()));
            customerOrderService.setCustomerOrder(customerOrder);
            if(customerOrder.getStatus()==Status.SENT){
                mailService.sendOrderStatusInformation(oldOrder.getUser().getEmail(),"Twoje zamówienie zostało wysłane",
                        "Twoje zamówienie nr " + customerOrder.getOrderId() +" jest już w drodze i powinno być u Ciebie w ciągu 2 dni roboczych." +
                                " Dziękujemy i zapraszamy ponownie!");

            }else{
                mailService.sendOrderStatusInformation(oldOrder.getUser().getEmail(),"Twoje zamówienie zostało anulowane",
                        "Twoje zamówienie nr " + customerOrder.getOrderId() + "zostało przez nas anulowane. Zwrócimy środki na Twoje konto." +
                                " Przepraszamy za niedogodności.");
            }

            return new ResponseEntity<Void>(HttpStatus.OK);

        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PutMapping("/{orderId}")
    public ResponseEntity<Void> updateCustomerOrder(@Valid @RequestBody CustomerOrder customerOrder,
                                           @PathVariable Long orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        CustomerOrder order =  customerOrderService.getCustomerOrder(orderId).orElseThrow();
        Long userId = order.getUser().getUserId();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin) {
            CustomerOrder oldOrder =  customerOrderService.getCustomerOrderToCollectByUserId(userId);
            customerOrder.setOrderId(oldOrder.getOrderId());
            customerOrder.setUser(oldOrder.getUser());
            customerOrder.setRequestDate(oldOrder.getRequestDate());
            customerOrderService.setCustomerOrder(customerOrder);
                return new ResponseEntity<Void>(HttpStatus.OK);

        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PutMapping("/admin/{orderId}")
    public ResponseEntity<Void> adminUpdateCustomerOrder(@Valid @RequestBody CustomerOrder customerOrder,
                                            @PathVariable Long orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(isAdmin) {
            CustomerOrder oldOrder =  customerOrderService.getCustomerOrder(orderId).orElseThrow();
            customerOrder.setOrderId(oldOrder.getOrderId());
            customerOrder.setUser(oldOrder.getUser());
            customerOrder.setRequestDate(oldOrder.getRequestDate());
            customerOrder.setStatus(oldOrder.getStatus());
            customerOrderService.setCustomerOrder(customerOrder);
            return new ResponseEntity<Void>(HttpStatus.OK);

        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PutMapping("/pay/{userId}")
    public ResponseEntity<Void> payCustomerOrder(@Valid @RequestBody CustomerOrder customerOrder,
                                            @PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin) {
            CustomerOrder oldOrder =  customerOrderService.getCustomerOrderToCollectByUserId(userId);
            customerOrder.setOrderId(oldOrder.getOrderId());
            customerOrder.setStatus(Status.PAID);
            customerOrder.setPaymentDate(Timestamp.valueOf(LocalDateTime.now()));
            customerOrder.setRequestDate(oldOrder.getRequestDate());
            customerOrderService.setCustomerOrder(customerOrder);
            mailService.sendOrderStatusInformation(oldOrder.getUser().getEmail(),"Twoje zamówienie zostało opłacone",
                    "Dziękujemy za złożenie zamówienia! Twoje zamówienie nr "+ oldOrder.getOrderId() + " zostało opłacone. " +
                            "Poinformujemy Cię o zmianie statusu zamówienia.");
            return new ResponseEntity<Void>(HttpStatus.OK);
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteCustomerOrder(@PathVariable Long orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> u =  userService.findByEmail(auth.getName());
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        Optional<CustomerOrder> co = customerOrderService.getCustomerOrder(orderId);
        if(co.isPresent() && u.isPresent()){
            if(u.get().getUserId()==co.get().getUser().getUserId() || isAdmin) {
                customerOrderService.deleteCustomerOrder(orderId);
                return new ResponseEntity<Void>(HttpStatus.OK);
            }else{
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/withitems/{orderId}")
    public ResponseEntity<Void> deleteCustomerOrderAndItems(@PathVariable Long orderId) {

        return customerOrderService.getCustomerOrder(orderId).map(order -> {
            if(order.getStatus()==Status.PAID){
                mailService.sendOrderStatusInformation(order.getUser().getEmail(),"Twoje zamówienie zostało anulowane",
                        "Twoje zamówienie nr " + order.getOrderId() + "zostało przez nas anulowane. Zwrócimy środki na Twoje konto." +
                                " Przepraszamy za niedogodności.");
            }
            order.getCustomerOrderItems().forEach(item ->{
                customerOrderItemService.deleteCustomerOrderItem(item.getItemId());
            });
            customerOrderService.deleteCustomerOrder(orderId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping
    Page<CustomerOrder> getCustomerOrders(@RequestParam(name = "page", defaultValue = "0") int page,
                                  @RequestParam(name = "size", defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return customerOrderService.getAllCustomerOrders(pageable);
    }
    @GetMapping("/byuser/{userId}")
    Page<CustomerOrder> getCustomerOrdersByUser(@PathVariable Long userId,@RequestParam(name = "page", defaultValue = "0") int page,
                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin){
            return customerOrderService.getCustomerOrdersByUser(u,pageable);
        }else{
            return Page.empty();
        }
    }
    @GetMapping("/finished/{userId}")
    Page<CustomerOrder> getFinishedCustomerOrdersByUser(@PathVariable Long userId,@RequestParam(name = "page", defaultValue = "0") int page,
                                        @RequestParam(name = "size", defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin){
            return customerOrderService.getActiveCustomerOrders(userId,pageable);
        }else{
            return Page.empty();
        }
    }
    @GetMapping("/collected/{userId}")
    public ResponseEntity<?> getCustomerOrderToCollectByUser(@PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin){
            CustomerOrder or = customerOrderService.getCustomerOrderToCollectByUserId(userId);
            if(or != null){
                return ResponseEntity.ok(customerOrderService.getCustomerOrderToCollectByUserId(userId));
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "Brak zamówienia."));
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "Odmowa dostępu."));
        }
    }
}
