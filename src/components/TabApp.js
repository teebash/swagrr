import React, {
  StyleSheet,
  Component,
  View,
  TabBarIOS,
  Text,
  TouchableOpacity,
  PropTypes
} from 'react-native';

const TabApp = ({onTabSelect, selectedTab}) =>  {

  

  TabApp.propTypes = {
    onTabSelect: PropTypes.func.isRequired,
    selectedTab: PropTypes.string.isRequired
  }

  const _renderContent = (color, icon, text) => {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{icon}</Text>
        <Text>
          Hello {text}
        </Text>
      </View>
    );
  }

  return (
      <TabBarIOS selectedTab={selectedTab}>
        <TabBarIOS.Item
          title="Home"
          selected={selectedTab === 'home'}
          onPress={() => {
            onTabSelect('home');
        }}>
        {_renderContent('#414A8C', '🏚')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Search"
          selected={selectedTab === 'search'}
          onPress={() => {
            onTabSelect('search');
        }}>
        {_renderContent('#414A8C', '🔍')}
        </TabBarIOS.Item>
      </TabBarIOS>
  )
}

export default TabApp

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});
