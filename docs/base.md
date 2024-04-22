


### 依赖倒置原则（DIP）
[text](https://zhuanlan.zhihu.com/p/77415657)

按照设计汽车为例： 




### 控制反转（IoC）
IoC  是一种框架解耦的设计思想。类的调用只依赖接口或者配置，而不是通过类中的实现。

将原本由代码直接操控的对象的调用权交给第三方（通常是一个容器 (IoC容器)）来控制，以解耦代码，提高可维护性。




### 控制反转（IoC） 容器

IoC 容器负责创建对象、管理对象之间的关系，并在需要的时候将对象注入到代码中。 

代码就不再直接依赖于具体的对象实例，而是依赖于 IoC 容器的配置和注入


前端实现 IoC 容器示例:

``` typescript
// ioc 接口
interface IoCContainer { 
  register<T>(key: symbol, instance: {new (...args: any[]): T }):void;
  resolve<T>(key: symbol): T;
}

// 接口实现
class Container implements IoCContainer {
  private registry: Map<symbol, any> = new Map();

  register<T>(key: symbol, instance: {new (...args: any[])}): void {
    this.registry.set(key, instance)
  }

  resolve<T>(key: symbol): T {
    const instance = this.registry.get(key);

    return  new instance() as T;
  }
}



// 服务接口
interface IUserService {
  getUserId(id: number): any;

}

// 接口实现

class UserService implements  IUserService {
  getUserId(id: number) {
    return {id}
  }
}

// 创建ioc  容器

const container = new  Container();

// 将UserService 注册到 ioc 容器中

const userServiceKey = symbol('UserService');

container.register(userServiceKey, UserService);


// 容器中获取服务UserService实例

const userService: IUserService = container.resolve<IUserService>(userServiceKey);


// 使用UserService实例
const user = userService.getUserId(1);


```

### 依赖注入(DI) 

依赖注入是一种设计模式，是控制反转的一种实现方式。


依赖注入就是将实例变量传入到一个对象中去.



### nestjs 储库模式  Repository





### nestjs 请求生命周期顺序

收到请求
全局绑定的中间件
模块绑定的中间件
全局守卫
控制层守卫
路由守卫
全局拦截器（控制器之前）
控制器层拦截器 （控制器之前）
路由拦截器 （控制器之前）
全局管道
控制器管道
路由管道
路由参数管道
控制器（方法处理器）   服务（如果有）
路由拦截器（请求之后）
控制器拦截器 （请求之后）
全局拦截器 （请求之后）
异常过滤器 （路由，之后是控制器，之后是全局）
服务器响应