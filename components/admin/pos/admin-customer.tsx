"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";

import {
  getProductsWithMainImage,
  createAdminCustomerCart,
  getAdminCustomerCart,
  addItemToAdminCustomerCart,
  updateAdminCustomerCartItemQuantity,
  removeAdminCustomerCartItem,
} from "@/lib/actions/admin-actions/admin-customer-cart";

import CustomerInfoForm from "./customerinfo";
import {
  ProductWithImage,
  AdminCartWithItems,
} from "@/lib/validations/admin-cart.types";

export default function AdminCustomerCartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();

  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [cart, setCart] = useState<AdminCartWithItems | null>(null);
  const [cartId, setCartId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    initializeCart();
  }, []);

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast.error(locale === "pt" ? "Checkout cancelado" : "Checkout cancelled");
    }
  }, [searchParams, locale]);

  const initializeCart = async () => {
    setLoading(true);
    try {
      const productsData = await getProductsWithMainImage();
      setProducts(productsData);

      let currentCartId = localStorage.getItem("adminCustomerCartId");

      if (!currentCartId) {
        const result = await createAdminCustomerCart();
        if (result.success && result.cartId) {
          currentCartId = result.cartId;
          localStorage.setItem("adminCustomerCartId", currentCartId);
        }
      }

      if (currentCartId) {
        setCartId(currentCartId);
        await loadCart(currentCartId);
      }
    } catch (error) {
      toast.error(locale === "pt" ? "Falha ao inicializar carrinho" : "Failed to initialize cart");
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async (id: string) => {
    try {
      const cartData = await getAdminCustomerCart(id);
      setCart(cartData);
    } catch {}
  };

  const handleAddToCart = async (productId: string) => {
    if (!cartId) return toast.error(locale === "pt" ? "Carrinho não inicializado" : "Cart not initialized");

    setProcessingItems((prev) => new Set(prev).add(productId));

    try {
      const result = await addItemToAdminCustomerCart({
        cartId,
        productId,
        quantity: 1,
      });

      if (result.success) {
        const updatedCart = await getAdminCustomerCart(cartId);
        setCart(updatedCart);
        toast.success(locale === "pt" ? "Adicionado ao carrinho" : "Added to cart");
      }
    } finally {
      setProcessingItems((prev) => {
        const s = new Set(prev);
        s.delete(productId);
        return s;
      });
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setProcessingItems((prev) => new Set(prev).add(itemId));

    try {
      const result = await updateAdminCustomerCartItemQuantity({
        cartItemId: itemId,
        quantity: newQuantity,
      });

      if (result.success) {
        const updatedCart = await getAdminCustomerCart(cartId);
        setCart(updatedCart);
      }
    } finally {
      setProcessingItems((prev) => {
        const s = new Set(prev);
        s.delete(itemId);
        return s;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setProcessingItems((prev) => new Set(prev).add(itemId));

    try {
      const result = await removeAdminCustomerCartItem(itemId);

      if (result.success) {
        const updatedCart = await getAdminCustomerCart(cartId);
        setCart(updatedCart);
        toast.success(locale === "pt" ? "Removido" : "Removed");
      }
    } finally {
      setProcessingItems((prev) => {
        const s = new Set(prev);
        s.delete(itemId);
        return s;
      });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => {
        const productNameEn = typeof p.productName === 'object' ? p.productName.en : p.productName;
        const productNamePt = typeof p.productName === 'object' ? p.productName.pt : '';
        return (
          productNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          productNamePt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    );
  }, [products, searchQuery]);

  const cartSubtotal =
    cart?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (showCheckout && cartId) {
    return (
      <CustomerInfoForm cartId={cartId} onBack={() => setShowCheckout(false)} />
    );
  }

  return (
    <div className="bg-white  pb-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {locale === "pt" ? "Carrinho do Cliente Admin" : "Admin Customer Cart"}
          </h1>
          <p className="text-neutral-600 mt-1">
            {locale === "pt" 
              ? "Criar pedidos para clientes presenciais"
              : "Create orders for walk-in customers"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-neutral-900">
                  {locale === "pt" ? "Catálogo de Produtos" : "Product Catalog"}
                </CardTitle>
                <CardDescription className="text-neutral-500">
                  {locale === "pt" 
                    ? "Selecione produtos para adicionar ao carrinho"
                    : "Select products to add to cart"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Input
                  placeholder={locale === "pt" ? "Pesquisar produtos..." : "Search products..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="border-neutral-200 hover:shadow-md transition rounded-xl"
                    >
                      <CardContent className="p-4">
                        {product.mainImage && (
                          <img
                            src={product.mainImage.url}
                            alt={getTranslatedText(product.productName, locale) || "Product"}
                            className="w-full h-40 object-contain rounded-md mb-3 bg-white p-2"
                          />
                        )}

                        <h3 className="font-medium text-neutral-900 line-clamp-2">
                          {getTranslatedText(product.productName, locale) || "No name"}
                        </h3>

                        <p className="text-sm text-neutral-600">
                          {product.brand} {product.model}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-lg font-semibold text-neutral-900">
                              €{product.pricing.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {locale === "pt" ? "Estoque" : "Stock"}: {product.pricing.stockQuantity}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={
                              !product.pricing.inStock ||
                              product.pricing.stockQuantity === 0 ||
                              processingItems.has(product.id)
                            }
                            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            {processingItems.has(product.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE – CART SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="border-neutral-200 shadow-sm rounded-xl sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neutral-900">
                  <ShoppingCart className="w-5 h-5" />
                  {locale === "pt" ? "Resumo do Carrinho" : "Cart Summary"}
                </CardTitle>
                <CardDescription className="text-neutral-500">
                  {cart?.items.length || 0} {locale === "pt" 
                    ? cart?.items.length !== 1 ? "itens" : "item"
                    : cart?.items.length !== 1 ? "items" : "item"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* CART ITEMS */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 mb-4">
                  {cart?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                    >
                      {item.product.mainImage && (
                        <img
                          src={item.product.mainImage.url}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded bg-white p-1"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-neutral-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-600">
                          €{item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              processingItems.has(item.id) || item.quantity <= 1
                            }
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={processingItems.has(item.id)}
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          {/* Remove */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={processingItems.has(item.id)}
                            className="h-6 w-6 p-0 ml-auto text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* TOTALS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{locale === "pt" ? "Subtotal" : "Subtotal"}</span>
                    <span className="font-medium">
                      €{cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{locale === "pt" ? "Imposto" : "Tax"}</span>
                    <span className="font-medium">€0.00</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{locale === "pt" ? "Envio" : "Shipping"}</span>
                    <span className="font-medium">€0.00</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>{locale === "pt" ? "Total" : "Total"}</span>
                    <span className="text-indigo-600">
                      €{cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                  disabled={!cart || cart.items.length === 0}
                >
                  {locale === "pt" ? "Prosseguir para Checkout" : "Proceed to Checkout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
