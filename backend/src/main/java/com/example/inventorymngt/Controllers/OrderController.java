package com.example.inventorymngt.Controllers;

import com.example.inventorymngt.dto.CreateOrderRequest;
import com.example.inventorymngt.entity.OrderEntity;
import com.example.inventorymngt.entity.ProductEntitiy;
import com.example.inventorymngt.service.OrderService;
import com.example.inventorymngt.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;

    public OrderController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }

    // ─── Storefront Product Endpoints ────────────────────────────────────────

    @GetMapping("/api/store/products")
    public List<ProductEntitiy> listStoreProducts() {
        return productService.getProducts();
    }

    @GetMapping("/api/store/products/{id}")
    public ProductEntitiy getStoreProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    // ─── Order Endpoints ──────────────────────────────────────────────────────

    @PostMapping("/api/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderEntity createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/api/orders")
    public List<OrderEntity> listOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/api/orders/{id}")
    public OrderEntity getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/api/orders/{id}/cancel")
    public OrderEntity cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }
}
