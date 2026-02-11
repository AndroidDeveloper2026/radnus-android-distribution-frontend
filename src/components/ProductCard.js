import React from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import { Edit, Package } from "lucide-react-native";

const GREEN = "#2E7D32";
const GRAY = "#757575";

const ProductCard = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <View style={styles.iconCircle}>
            <Package size={18} color="#D32F2F" />
          </View>

          <View>
            <Text style={styles.productName}>
              {item.name}
            </Text>
            <Text style={styles.sku}>
              SKU: {item.sku}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Edit size={18} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* DETAILS */}
      <View style={styles.row}>
        <Text style={styles.label}>MRP</Text>
        <Text style={styles.value}>₹{item.mrp}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Distributor Price</Text>
        <Text style={styles.value}>
          ₹{item.distributorPrice}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Retailer Price</Text>
        <Text style={styles.value}>
          ₹{item.retailerPrice}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>GST</Text>
        <Text style={styles.value}>{item.gst}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>MOQ</Text>
        <Text style={styles.value}>{item.moq}</Text>
      </View>

      {/* STATUS */}
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {item.status}
        </Text>
      </View>
    </View>
  );
};

 export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212121",
  },

  sku: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },

  label: {
    fontSize: 13,
    color: GRAY,
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#212121",
  },

  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: GREEN,
  },
});

export default ProductCard;






