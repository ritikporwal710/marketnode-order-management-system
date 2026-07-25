package com.example.inventorymngt.service;

import com.example.inventorymngt.dto.CreateOrderRequest;
import com.example.inventorymngt.entity.OrderEntity;
import com.example.inventorymngt.entity.OrderRepo;
import com.example.inventorymngt.entity.ProductEntitiy;
import com.example.inventorymngt.entity.ProductRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    public OrderService(OrderRepo orderRepo, ProductRepo productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public OrderEntity createOrder(CreateOrderRequest request) {
        // 1. Find the product — reject if it doesn't exist
        ProductEntitiy product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found with id: " + request.getProductId()));

        // 2. Check stock availability
        if (product.getStock() < request.getQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + product.getStock() + ", Requested: " + request.getQuantity());
        }

        // 3. Deduct stock
        product.setStock(product.getStock() - request.getQuantity());
        productRepo.save(product);

        // 4. Snapshot product details and compute total
        double unitPrice = product.getPrice();
        double totalAmount = Math.round(unitPrice * request.getQuantity() * 100.0) / 100.0;

        // 5. Create and persist the order
        OrderEntity order = new OrderEntity();
        order.setUserId(request.getUserId());
        order.setProductId(product.getId());
        order.setProductName(product.getName());
        order.setQuantity(request.getQuantity());
        order.setUnitPrice(unitPrice);
        order.setTotalAmount(totalAmount);
        order.setStatus("CREATED");

        return orderRepo.save(order);
    }

    @Transactional
    public OrderEntity cancelOrder(Long id) {
        // 1. Find the order — reject if it doesn't exist
        OrderEntity order = orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found with id: " + id));

        // 2. Only CREATED orders can be cancelled
        if (!"CREATED".equals(order.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only orders with status CREATED can be cancelled. Current status: " + order.getStatus());
        }

        // 3. Change status to CANCELLED
        order.setStatus("CANCELLED");

        // 4. Restore stock if the product still exists
        if (order.getProductId() != null) {
            productRepo.findById(order.getProductId()).ifPresent(product -> {
                product.setStock(product.getStock() + order.getQuantity());
                productRepo.save(product);
            });
        }

        return orderRepo.save(order);
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepo.findAll();
    }

    public OrderEntity getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found with id: " + id));
    }
}
