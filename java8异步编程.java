java8之前的异步编程框架比较弱, 也有各种库提供了自己的异步框架,例如scala, netty,mina 等都提供了自己的future,promise框架 ,

java 8内置了CompletableFuture,  比之前的Future＜T＞强太多,可以很好的支持异步编程,无需引入各种库,值得试试

异步编程也是比较流行的(高并发的程序都是异步模式),  可以学学, 并在微服务开发中实践总结创新, 

好处是能利用少量线程处理大量请求. 系统更高效.





学习难度适中,比js回调简单, 可以方便的把多个异步过程链接起来 

例子1,回调


CompletableFuture＜Integer＞ future = CompletableFuture.supplyAsync(() -＞ {

   try {

Thread.sleep(1001);

} catch (Exception e) {

e.printStackTrace();

}

return 100;

});

future.thenAccept(System.out::println);//异步执行的结果处理, 类似回调, 程序运行到这里不阻塞

System.out.println("--");




例子2:任何一个future完成时处理,


CompletableFuture＜Integer＞ future1 = CompletableFuture.supplyAsync(() -＞ {

   try {

       Thread.sleep(1000);

   } catch (InterruptedException e) {

       e.printStackTrace();

   }

   return 100;

});

CompletableFuture＜String＞ future2 = CompletableFuture.supplyAsync(() -＞ {

   try {

       Thread.sleep(1200);

   } catch (InterruptedException e) {

       e.printStackTrace();

   }

   return "abc";

});

CompletableFuture＜Object＞ f0 =  CompletableFuture.anyOf(future1,future2);

f0.thenAccept(System.out::print);




例子3,自行探索..




一篇不错的入门文档:

http://www.cnblogs.com/leetieniu2014/p/5403277.html

