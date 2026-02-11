import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import styles from './CentralStockStyle';
import Header from '../../components/Header';

const CentralStock = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(''); // INWARD | OUTWARD | EDIT
  const [qty, setQty] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [stock, setStock] = useState([
    {
      id: 'P01',
      name: 'Fast Charger 20W',
      sku: 'FC20W',
      availableQty: 520,
      lastUpdated: '02 Feb 2026',
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },
    {
      id: 'P02',
      name: 'Type-C Cable',
      sku: 'TC100',
      availableQty: 1240,
      lastUpdated: '01 Feb 2026',
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },

        {
      id: 'P03',
      name: 'Type-C Cable',
      sku: 'TC100',
      availableQty: 1240,
      lastUpdated: '01 Feb 2026',
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },

        {
      id: 'P04',
      name: 'Type-C Cable',
      sku: 'TC100',
      availableQty: 1240,
      lastUpdated: '01 Feb 2026',
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },

        {
      id: 'P05',
      name: 'Type-C Cable',
      sku: 'TC100',
      availableQty: 1240,
      lastUpdated: '01 Feb 2026',
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },
  ]);

  /* 🔢 SUMMARY */
  const totalQty = stock.reduce((sum, p) => sum + p.availableQty, 0);

  /* 🔧 OPEN MODAL */
  const openModal = (product, type) => {
    setSelectedProduct(product);
    setMode(type);
    setQty('');
    setModalVisible(true);
  };

  /* 💾 SAVE ACTION */
  const saveAction = () => {
    if (!qty || !selectedProduct) return;

    setStock(prev =>
      prev.map(p => {
        if (p.id !== selectedProduct.id) return p;

        let updatedQty = p.availableQty;

        if (mode === 'INWARD') {
          updatedQty += parseInt(qty);
        }

        if (mode === 'OUTWARD') {
          updatedQty =
            p.availableQty - parseInt(qty) < 0
              ? 0
              : p.availableQty - parseInt(qty);
        }

        if (mode === 'EDIT') {
          updatedQty = parseInt(qty);
        }

        return {
          ...p,
          availableQty: updatedQty,
          lastUpdated: 'Today',
        };
      }),
    );

    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      {/* 🖼 PRODUCT IMAGE */}
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="contain"
      />

      {/* 📦 PRODUCT INFO */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sku}>SKU: {item.sku}</Text>
        <Text style={styles.date}>
          Updated: {item.lastUpdated}
        </Text>
      </View>

      {/* 🔢 QTY */}
      <View style={styles.qtyBox}>
        <Text style={styles.qty}>{item.availableQty}</Text>
        <Text style={styles.qtyLabel}>Units</Text>
      </View>
    </View>

    {/* ACTIONS */}
    <View style={styles.actionsRow}>
      <TouchableOpacity
        style={styles.inwardBtn}
        onPress={() => openModal(item, "INWARD")}
      >
        <Text style={styles.btnText}>+ Inward</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outwardBtn}
        onPress={() => openModal(item, "OUTWARD")}
      >
        <Text style={styles.btnText}>- Outward</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => openModal(item, "EDIT")}
      >
        <Text style={styles.btnText}>✏️ Edit</Text>
      </TouchableOpacity>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Central Stock</Text>
        <Text style={styles.headerSub}>
          Company Inventory
        </Text>
      </View> */}

      <Header title={'Company Inventory'} />

      {/* 🔴 SUMMARY BAR */}
      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.summaryValue}>{stock.length}</Text>
          <Text style={styles.summaryLabel}>SKUs</Text>
        </View>

        <View>
          <Text style={styles.summaryValue}>{totalQty}</Text>
          <Text style={styles.summaryLabel}>Total Units</Text>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={stock}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* MODAL */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{mode} Stock</Text>

            <Text style={styles.modalProduct}>{selectedProduct?.name}</Text>

            <TextInput
              placeholder={
                mode === 'EDIT' ? 'Enter exact quantity' : 'Enter quantity'
              }
              keyboardType="number-pad"
              value={qty}
              onChangeText={setQty}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.CancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={saveAction}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CentralStock;
