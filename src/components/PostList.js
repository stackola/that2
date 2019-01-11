import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Platform,
  UIManager,
  LayoutAnimation
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
      items: []
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  addNew(path) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(s => {
      return {
        ...s,
        items: [
          path,
          ...s.items.filter(i => {
            return i != path;
          })
        ]
      };
    });
  }
  componentDidMount() {
    // get 10 times.
    getPosts(this.props.path, 10)
      .then(snap => {
        //console.log(snap);
        this.setState(
          s => {
            return {
              ...s,
              items: snap._docs.map(d => {
                return d._ref.path;
              })
            };
          },
          () => {
            //console.log(this.state);
            this.subscribeToNewest();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });

    //initialize subscription to first object
  }

  loadMore() {}

  subscribeToNewest() {
    this.sub1 = subTo(this.props.path, 1).onSnapshot(i => {
      i._changes.map(c => {
        //console.log(c);
        if (c.type == "added") {
          //console.log("adding", c._document._ref.path);
          this.addNew(c._document._ref.path);
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

  render() {
    let color = this.props.color;
    let path = this.props.path;
    return (
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        ListFooterComponent={this.props.footer}
        ListHeaderComponent={
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
        }
        keyExtractor={i => {
          return i;
        }}
        style={{ flex: 1 }}
        data={this.state.items}
        renderItem={i => {
          let p = i.item;
          return (
            <PostLoader color={color} path={p} realtime={true}>
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
