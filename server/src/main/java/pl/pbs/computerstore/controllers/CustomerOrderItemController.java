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
import pl.pbs.computerstore.model.*;
import pl.pbs.computerstore.service.CustomerOrderItemService;
import pl.pbs.computerstore.service.CustomerOrderService;
import pl.pbs.computerstore.service.ProductService;
import pl.pbs.computerstore.service.UserService;

import java.net.URI;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/item")
public class CustomerOrderItemController {
    private CustomerOrderItemService customerOrderItemService;
    private CustomerOrderService customerOrderService;
    private UserService userService;
    private ProductService productService;
    public CustomerOrderItemController(CustomerOrderItemService customerOrderItemService, CustomerOrderService customerOrderService, UserService userService, ProductService productService) {
        this.customerOrderItemService = customerOrderItemService;
        this.customerOrderService = customerOrderService;
        this.userService = userService;
        this.productService = productService;
    }
    @GetMapping("/{itemId}")
    ResponseEntity<CustomerOrderItem> getCustomerOrderItem(@PathVariable Long itemId) {
        return ResponseEntity.of(customerOrderItemService.getCustomerOrderItem(itemId));
    }
    @PostMapping
    ResponseEntity<Void> createCustomerOrderItem(@Valid @RequestBody CustomerOrderItem customerOrderItem) {
        CustomerOrderItem createdCustomerOrderItem = customerOrderItemService.setCustomerOrderItem(customerOrderItem);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
             .path("/{itemId}").buildAndExpand(createdCustomerOrderItem.getItemId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Void> updateCustomerOrderItem(@Valid @RequestBody CustomerOrderItem customerOrderItem,
                                            @PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin) {
            CustomerOrderItem oldOrderItem =  customerOrderItemService.getCustomerOrderItem(customerOrderItem.getItemId()).orElseThrow();
            customerOrderItem.setItemId(oldOrderItem.getItemId());
            customerOrderItemService.setCustomerOrderItem(customerOrderItem);
            return new ResponseEntity<Void>(HttpStatus.OK);

        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PutMapping("/updatequantityandprice")
    public ResponseEntity<Void> updateCustomerOrderItemQuantityAndPrice(@Valid @RequestBody CustomerOrderItem customerOrderItem) {
     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        CustomerOrderItem oldOrderItem =  customerOrderItemService.getCustomerOrderItem(customerOrderItem.getItemId()).orElseThrow();
        Long userId = oldOrderItem.getCustomerOrder().getUser().getUserId();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin) {
            customerOrderItem.setItemId(oldOrderItem.getItemId());
            customerOrderItem.setCustomerOrder(oldOrderItem.getCustomerOrder());
            customerOrderItem.setProduct(oldOrderItem.getProduct());
            customerOrderItemService.setCustomerOrderItem(customerOrderItem);
            return new ResponseEntity<Void>(HttpStatus.OK);

        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteCustomerOrderItem(@PathVariable Long itemId) {
        Optional<CustomerOrderItem> customerOrderItem = customerOrderItemService.getCustomerOrderItem(itemId);
        if (customerOrderItem.isPresent()) {
            CustomerOrder customerOrder = customerOrderItem.get().getCustomerOrder();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User u = userService.findByEmail((String) auth.getName()).orElseThrow();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));
            if (u.getUserId() == customerOrder.getUser().getUserId() || isAdmin) {
                customerOrderItemService.deleteCustomerOrderItem(itemId);
                return new ResponseEntity<Void>(HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping
    Page<CustomerOrderItem> getCustomerOrderItems(@RequestParam(name = "page", defaultValue = "0") int page,
                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return customerOrderItemService.getCustomerOrderItems(pageable);
    }
    @GetMapping("/byorder/{orderId}")
    Page<CustomerOrderItem> getCustomerOrderItemsByCustomerOrder(@PathVariable Long orderId,@RequestParam(name = "page", defaultValue = "0") int page,
                                                @RequestParam(name = "size", defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        CustomerOrder co = customerOrderService.getCustomerOrder(orderId).orElseThrow();
        Long userId = co.getUser().getUserId();
        if(u.getUserId()==userId || isAdmin){
            return customerOrderItemService.getCustomerOrderItemsByOrder(co,pageable);
        }else{
            return Page.empty();
        }
    }
    @GetMapping("/added")
    ResponseEntity<CustomerOrderItem> getItemProductInfo(@RequestParam(name = "productId") long productId,
                                                         @RequestParam(name = "orderId") long orderId) {
        CustomerOrder co = customerOrderService.getCustomerOrder(orderId).orElseThrow();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        Product p = productService.getProduct(productId).orElseThrow();
        if(u.getUserId()==co.getUser().getUserId() || isAdmin){
            Optional<CustomerOrderItem> item = customerOrderItemService.getCustomerOrderItemByCustomerOrderAndProduct(co, p);
            if(item.isPresent()) {
                return ResponseEntity.ok(item.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/collected/{userId}")
    public ResponseEntity<?> getCustomerOrderItemsToCollectByUser(@PathVariable Long userId,@RequestParam(name = "page", defaultValue = "0") int page,
                                                                  @RequestParam(name = "size", defaultValue = "4") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User u =  userService.findByEmail((String) auth.getName()).orElseThrow();
        Pageable pageable = PageRequest.of(page, size);
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if(u.getUserId()==userId || isAdmin){
            CustomerOrder or = customerOrderService.getCustomerOrderToCollectByUserId(userId);
            if(or != null){
                return ResponseEntity.ok(customerOrderItemService.getCustomerOrderItemsByOrder(or,pageable));
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "Brak zamówienia."));
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", "Odmowa dostępu."));
        }
    }
}

