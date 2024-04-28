### 有关使用 Passport 安全登录认证说明
在 Nest.js 中使用 Passport 实现登录认证时，通常会结合使用 Local 策略和 JWT 策略。这两种策略有不同的作用：

1. Local 策略：
- Local 策略用于处理基本的用户名密码认证。
- 当用户尝试登录时，会提交用户名和密码。
- Local 策略验证用户名和密码的有效性，并在验证通过时生成 JWT。
- JWT 将用于后续的请求认证，从而允许用户访问受保护的资源。


2. JWT 策略：
- JWT 策略用于验证 JWT 的有效性，并提取其中的用户信息。
- 当用户发送包含 JWT 的请求时，JWT 策略会验证 JWT 的签名和有效期。
- 如果 JWT 有效，JWT 策略会提取其中的用户信息，并将其添加到请求对象中，以便后续的路由处理程序使用。

结合使用 Local 策略和 JWT 策略的好处在于：

Local 策略负责验证用户名和密码，并生成 JWT。这使得认证逻辑集中在一个地方，易于管理和维护。
JWT 策略负责验证 JWT 的有效性，并提取用户信息。这使得认证逻辑解耦，使得在不同的路由中可以灵活地使用 JWT 进行认证。



###  Passport 的请求范围策略（Request Scope Strategy）
Passport 的请求范围策略（Request Scope Strategy）是一种 Passport 策略，用于验证用户是否具有访问特定资源的权限。它的主要作用是限制对资源的访问，以确保用户具有访问特定资源的权限。

请求范围策略通常与 OAuth2.0 或类似的身份验证和授权协议一起使用。在这些协议中，每个授权令牌都可以包含一个或多个范围（Scope），用于表示用户对资源的访问权限。请求范围策略就是用来验证用户的授权令牌中是否包含了访问当前请求所需资源的范围。

例如，在一个 Web 应用中，你可能有一些受保护的 API 端点，只有经过授权的用户才能访问。通过使用请求范围策略，你可以确保用户在访问受保护的 API 端点时具有正确的权限。

在 Nest.js 中，你可以使用 Passport 来实现请求范围策略。你需要创建一个 Passport 策略，并在该策略中验证用户的授权令牌中是否包含了所需的范围。如果授权令牌中包含了正确的范围，就认为用户具有访问资源的权限；否则，就拒绝访问，并返回相应的错误响应。

总的来说，请求范围策略的用处在于确保用户在访问受保护的资源时具有正确的权限，从而提高系统的安全性和可靠性。