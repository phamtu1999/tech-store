package com.techstore.repository.cart;

import com.techstore.entity.cart.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query(value = "SELECT p.name, COUNT(ci.id), SUM(pv.price * ci.quantity) " +
           "FROM cart_items ci " +
           "JOIN product_variants pv ON ci.variant_id = pv.id " +
           "JOIN products p ON pv.product_id = p.id " +
           "GROUP BY p.name " +
           "ORDER BY COUNT(ci.id) DESC", nativeQuery = true)
    List<Object[]> getAbandonedCartInsights();

    @Query("SELECT COUNT(DISTINCT ci.cart.user.id) FROM CartItem ci")
    long countUsersWithItemsInCart();
}
