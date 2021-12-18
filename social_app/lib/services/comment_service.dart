import 'dart:convert';
import 'dart:io';

import 'package:social_app/models/comment_model.dart';
import 'package:social_app/models/post.dart';
import 'package:http/http.dart' as http;
import 'package:async/async.dart';
import 'package:http_parser/http_parser.dart';
import 'package:social_app/utilities/configs.dart';


Future<List<CommentModel>> getCommentList(String postId, String token) async {
  print("post ID: $postId");
  var res = await http.get(Uri.parse(localhost + "/v1/postComment/list/" + postId),
      headers: {
        'Context-Type': 'application/json;charSet=UTF-8',
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },);

  var responseJson = json.decode(res.body);
  print(responseJson["data"].toString());
  return (responseJson["data"] as List).map((p) => CommentModel.fromJson(p)).toList();

}

Future<String> createComment(String postId, CommentModel comment, String token) async {
  var res = await http.post(Uri.parse(localhost + "/v1/postComment/create/" + postId),
      headers: {
        'Context-Type': 'application/json;charSet=UTF-8',
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        //'Content-Type': 'application/json',
      },
      body: {
        "content": comment.content,
        "commentAnswered": comment.commentAnsweredId,
        "index":"1",
        "count":"10",
      });
  print(res.statusCode);
  return res.statusCode.toString();
}


