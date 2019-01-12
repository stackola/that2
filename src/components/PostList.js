import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Platform,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import colors from "That/src/colors";
import { getPosts, subTo } from "That/src/lib";
import InputBox from "That/src/components/InputBox";
import PostLoader from "That/src/components/PostLoader";
import ImagePost from "That/src/components/ImagePost";
export default class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reloadKey: 1,
      items: [],
      hasMore: true
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  addNew(item) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(s => {
      return {
        ...s,
        items: [
          item,
          ...s.items.filter(i => {
            return i.id != item.id;
          })
        ]
      };
    });
  }
  componentDidMount() {
    // get 10 times.
    this.initialize();
    //initialize subscription to first object
  }
  initialize(refreshing) {
    console.log("post list mounted!");
    let coll = this.props.collection || "posts";
    getPosts(this.props.path, 10, coll, this.props.sort || "updated")
      .then(snap => {
        //console.log(snap);
        if (snap._docs.length == 0) {
          this.props.reSort !== false && this.subscribeToNewest();
          this.setState({ hasMore: false, refreshing: false });
          return;
        }
        refreshing &&
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState(
          s => {
            console.log(snap);
            return {
              ...s,
              refreshing: false,
              items: snap._docs.map(d => {
                return d;
              })
            };
          },
          () => {
            //console.log(this.state);
            this.props.reSort !== false && this.subscribeToNewest();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
  extractInitialPath(c) {
    if (this.props.initialPathExtractor) {
      return this.props.initialPathExtractor(c);
    } else {
      return c._ref.path;
    }
  }
  extractPath(c) {
    if (this.props.pathExtractor) {
      return this.props.pathExtractor(c);
    } else {
      return c._document._ref.path;
    }
  }
  subscribeToNewest() {
    let coll = this.props.collection || "posts";
    this.sub1 = subTo(
      this.props.path,
      1,
      coll,
      this.props.sort || "updated"
    ).onSnapshot(i => {
      i._changes.map(c => {
        //console.log(c);
        if (c.type == "added") {
          //console.log("adding", c._document._ref.path);
          this.addNew(c._document);
        }
      });
    });
  }

  componentWillUnmount() {
    this.sub1 && this.sub1();
  }
  isBaseGroup() {
    let path = this.props.path;
    if (!path) {
      return false;
    }

    return path.split("/").length < 5;
  }
  endReached() {
    //if we are in real time mode, just ask for 10 more from the db after the current last one.
    if (!this.state.hasMore) {
      console.log("not getting more");
      return;
    }
    console.log("getting more");
    let coll = this.props.collection || "posts";
    console.log("end reached", this.state.items[this.state.items.length - 1]);
    getPosts(
      this.props.path,
      10,
      coll,
      this.props.sort || "updated",
      this.state.items[this.state.items.length - 1]
    )
      .then(snap => {
        console.log(snap);
        if (snap._docs.length == 0) {
          this.setState({ hasMore: false });
          return;
        }
        this.setState(
          s => {
            console.log(snap);
            return {
              ...s,
              items: [...s.items, ...snap._docs]
            };
          },
          () => {
            //console.log(this.state);
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
  refresh() {
    this.sub1 && this.sub1();
    this.setState({ refreshing: true }, () => {
      this.initialize(true);
    });
  }
  render() {
    let color = this.props.color;
    let path = this.props.path;
    //consoconsole.log(path);
    return (
      <FlatList
        key={path + this.state.reloadKey.toString()}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.refresh();
            }}
          />
        }
        onEndReached={() => {
          this.endReached();
        }}
        onEndReachedThreshold={0.05}
        keyboardShouldPersistTaps={"handled"}
        ListFooterComponent={
          <View>
            {!this.state.hasMore && (
              <View
                style={{
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text>You have reached the end</Text>
              </View>
            )}
            {this.state.hasMore && (
              <View
                style={{
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ActivityIndicator />
              </View>
            )}
            {this.props.footer}
          </View>
        }
        ListHeaderComponent={
          this.props.header ? (
            this.props.header
          ) : (
            <View>
              {this.props.postInHeader !== false && (
                <PostLoader color={color} path={path} realtime={true}>
                  {post => {
                    return (
                      <ImagePost
                        updated={post.updated}
                        color={color}
                        comments={post.comments}
                        linkToSelf={true}
                        path={post.parent + "/posts/" + post.id}
                        time={post.time}
                        text={post.text}
                        isHeader={true}
                        isBaseGroup={this.isBaseGroup()}
                        image={post.image ? post.image.url : null}
                        isHome={this.props.isHome}
                        username={post.name}
                        userId={post.user}
                      />
                    );
                  }}
                </PostLoader>
              )}
              {this.props.canPost !== false && (
                <InputBox path={path} color={color} />
              )}
            </View>
          )
        }
        keyExtractor={i => {
          return i.id;
        }}
        style={{ flex: 1 }}
        data={this.state.items}
        renderItem={i => {
          let p = i.item._data;
          let tp = this.extractInitialPath(i.item);
          console.log(p);
          return (
            <PostLoader color={color} path={tp} realtime={true}>
              {post => {
                return (
                  <ImagePost
                    updated={post.updated}
                    color={color}
                    comments={post.comments}
                    linkToSelf={true}
                    path={post.parent + "/posts/" + post.id}
                    time={post.time}
                    text={post.text}
                    image={post.image ? post.image.url : null}
                    isHome={this.props.isHome}
                    username={post.name}
                    userId={post.user}
                  />
                );
              }}
            </PostLoader>
          );
        }}
      />
    );
  }
}
