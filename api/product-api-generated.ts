/* tslint:disable */
/* eslint-disable */
/*
ClickFunnels API

# Introduction

The ClickFunnels v2 API lets you:

- import data from other apps and sources into ClickFunnels and export data that you need somewhere else
- extend the ClickFunnels platform to your own needs and embed it in your own applications
- act on behalf of other ClickFunnels users via OAuth to offer extended services to other fellow ClickFunnels entrepreneurs

We are starting with exposing a given set of resources but the goal is to converge in terms of
functionality with what the actual app is offering and also offering functionality on top.

For any feedback, please drop us a line at:

- https://feedback.myclickfunnels.com/feature-requests?category=api

For issues and support you can currently go here:

- https://help.clickfunnels.com/hc/en-us

# Authentication

Making your first request is easiest with a Bearer token:

```shell
$ curl 'https://myteam.myclickfunnels.com/api/v2/teams' \\
--header 'Authorization: Bearer AVJrj0ZMJ-xoraUk1xxVM6UuL9KXmsWmnJvvSosUO6X'
[{\"id\":3,\"name\":\"My Team\", # ... more output...}]
```

How to get your API key step by step:

https://developers.myclickfunnels.com/docs/getting-started

# Rate limiting

The rate limit is currently set per IP address.

The actual rate limit and the approach on how this is handled is subject to change in future
releases. Please let us know if you have special request limit needs.

# Pagination and Ordering

In order to paginate through a large list response, you can use our cursor-based pagination using
the `id` field of a given object in the list.

There is a limit of 20 objects per list response ordered ascending by ID. So, you can get to items
after the last one in the list, by taking the last item's ID and submitting it in a list request
as the value of an `after` URL parameter. For example:

```shell
# The first 20 contacts are returned without any pagination nor ordering params:
$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts' --header 'Authorization: Bearer ...'
[{\"id\": 1, \"email_address\": \"first@contact.com\" ...}, {\"id\": 4, ...} ... {\"id\": 55, \"email_address\": \"last@contact.com\", ...}]

$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?after=55' --header 'Authorization: Bearer ...'
[{\"id\": 56, ...}] # There is one more record after ID 55.
```

The `after` param always acts as if you are \"turning the next page\". So if you order in a descending
order, you will also use `after` to get to the next records:

```shell
$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?sort_order=desc' --header 'Authorization: Bearer ...'
[{\"id\": 56, ...},  {\"id\": 55, ...}, {\"id\": 4, ...}] # All contacts in descending order.

$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?sort_order=desc&after=4' --header 'Authorization: Bearer ...'
[{\"id\": 1, ...}] # There is one more contact on the next page after ID 55.
```

You can also use the `Pagination-Next` header to get the last ID value directly:

```http request
# Example header.
Pagination-Next: 55
```

And you can use the `Link` header to get the next page directly without needing to calculate it
yourself:

```http request
# Example header.
Link: <https://localteam.myclickfunnels.com/api/v2/workspaces/3/contacts?after=55>; rel=\"next\"
```

# Filtering

**Current filters**

If filtering is available for a specific endpoint, 'filter' will be listed as one of the options in the query parameters section of the Request area. Attributes by which you can filter will be listed as well.

**How it works**

There is a filter mechanism that adheres to some simple conventions. The filters provided on
list endpoints, like `filter[email_address]` and `filter[id]` on the `Contacts` list endpoint, need
to be \"simple\" and \"fast\". These filters are supposed to be easy to use and allow you to filter by
one or more concrete values.

Here's an example of how you could use the filter to find a contact with a certain email address:

```shell
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com' --header 'Authorization: Bearer ...'
[{\"email_address\": \"you@cf.com\",...}]
```

You can also filter by multiple values:

```shell
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com,u2@cf.com' --header 'Authorization: Bearer ...'
[{\"email_address\": \"you@cf.com\",...}, {\"email_address\": \"u2@cf.com\",...}]
```

You can also filter by multiple attributes. Similar to filters that you might be familiar with when
using GitHub (e.g.: filtering PRs by closed and assignee), those filters are `AND` filters, which
give you the intersection of multiple records:

```shell
# If you@cf.com comes with an ID of 1, you will only see this record for this API call:
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com,u2@cf.com&filter[id]=1' --header 'Authorization: Bearer ...'
[{\"email_address\": \"you@cf.com\",...}] 
# u2@cf.com is not included because it has a different ID that is not included in the filter.
```

> Please let us know your use case if you need more filter or complex search capabilities, we are 
> actively improving these areas: https://feedback.myclickfunnels.com/feature-requests?category=api

# Webhooks

ClickFunnels webhooks allow you to react to many events in the ClickFunnels app on your own server, 
Zapier and other similar tools.

You need to configure one or more endpoints within the ClickFunnels API by using the [Webhooks::Outgoing::Endpoints](https://apidocs.myclickfunnels.com/tag/Webhooks::Outgoing::Endpoint) 
endpoint with the `event_type_ids` that you want to listen to (see below for all types).

Once configured, you will receive POST requrests from us to the configured endpoint URL with the
[Webhooks::Outgoing::Event](https://apidocs.myclickfunnels.com/tag/Webhooks::Outgoing::Event#operation/getWebhooksOutgoingEvents) 
payload, that will contain the subject payload in the `data` property. Like here for the
`contact.identified` webhook in V2 version:

```json
{
  \"id\": null,
  \"public_id\": \"YVIOwX\",
  \"workspace_id\": 32,
  \"uuid\": \"94856650751bb2c141fc38436fd699cb\",
  \"event_type_id\": \"contact.identified\",
  \"subject_id\": 100,
  \"subject_type\": \"Contact\",
  \"data\": {
    \"id\": 12,
    \"public_id\": \"fdPJAZ\",
    \"workspace_id\": 32,
    \"anonymous\": null,
    \"email_address\": \"joe.doe@example.com\",
    \"first_name\": \"Joe\",
    \"last_name\": \"Doe\",
    \"phone_number\": \"1-241-822-5555\",
    \"time_zone\": \"Pacific Time (US & Canada)\",
    \"uuid\": \"26281ba2-7d3b-524d-8ea3-b01ff8414120\",
    \"unsubscribed_at\": null,
    \"last_notification_email_sent_at\": null,
    \"fb_url\": \"https://www.facebook.com/example\",
    \"twitter_url\": \"https://twitter.com/example\",
    \"instagram_url\": \"https://instagram.com/example\",
    \"linkedin_url\": \"https://www.linkedin.com/in/example\",
    \"website_url\": \"https://example.com\",
    \"created_at\": \"2023-12-31T18:57:40.871Z\",
    \"updated_at\": \"2023-12-31T18:57:40.872Z\",
    \"tags\": [
      {
        \"id\": 20,
        \"public_id\": \"bRkQrc\",
        \"name\": \"Example Tag\",
        \"color\": \"#59b0a8\"
      }
    ]
  },
  \"created_at\": \"2023-12-31T18:57:41.872Z\"
}
```

The content of the `data` property will vary depending on the event type that you are receiving.

Event types are structured like this: `subject.action`. So, for a `contact.identified` webhook, your
`data` payload will contain data that you can source from [the contact response schema/example in the
documentation](https://apidocs.myclickfunnels.com/tag/Contact#operation/getContacts). Similarly, for
webhooks like `order.created` and `one-time-order.identified`, you will find the documentation in
[the Order resource description](https://apidocs.myclickfunnels.com/tag/Order#operation/getOrders).

**Contact webhooks**

Are delivered with [the Contact data payload](https://apidocs.myclickfunnels.com/tag/Contact#operation/getContacts).

| <div style=\"width:375px;\">Event type</div>| Versions available | Description                                                            | 
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Contact***                                    |                    |                                                                        |
| `contact.created`                                | V1, V2             | Sent when a Contact is created                                         |
| `contact.updated`                                | V1, V2             | Sent when a Contact is updated                                         |
| `contact.deleted`                                | V1, V2             | Sent when a Contact is deleted                                         |
| `contact.identified`                             | V1, V2             | Sent when a Contact is identified by email address and/or phone number |
| `contact.unsubscribed`                           | V1, V2             | Sent when a Contact unsubscribes from getting communications from the ClickFunnels workspace                         |

**Contact::AppliedTag webhooks**

Are delivered with [the Contact::AppliedTag data payload](https://apidocs.myclickfunnels.com/tag/Contacts::AppliedTag#operation/getContactsAppliedTags)

| <div style=\"width:375px;\">Event type</div>| Versions available | Description                                                            |
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Contacts::AppliedTag***                       |                    |                                                                        |
| `contact/applied_tag.created`                    | V2                 | Sent when a Contacts::AppliedTag is created                            |
| `contact/applied_tag.deleted`                    | V2                 | Sent when a Contacts::AppliedTag is deleted

**Courses webhooks**

Payloads correspond to the respective API resources:

- [Course](https://apidocs.myclickfunnels.com/tag/Course#operation/getCourses)
- [Courses::Enrollment](https://apidocs.myclickfunnels.com/tag/Courses::Enrollment#operation/getCoursesEnrollments)
- [Courses::Section](https://apidocs.myclickfunnels.com/tag/Courses::Section#operation/getCoursesSections)
- [Courses::Lesson](https://apidocs.myclickfunnels.com/tag/Courses::Lesson#operation/getCoursesLessons)

| <div style=\"width:375px;\">Event type</div>| Versions available | Description                                                            | 
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Course***                                     |                    |                                                                        |
| `course.created`                                 | V2             | Sent when a Course is created                                          |
| `course.updated`                                 | V2             | Sent when a Course is updated                                          |
| `course.deleted`                                 | V2             | Sent when a Course is deleted                                          |
| `course.published`                               | V2                 | Sent when a Course has been published                                  |
| ***Courses::Enrollment***                        |                    |                                                                        |
| `courses/enrollment.created`                     | V2             | Sent when a Course::Enrollment is created                              |
| `courses/enrollment.updated`                     | V2             | Sent when a Course::Enrollment is updated                              |
| `courses/enrollment.deleted`                     | V2             | Sent when a Course::Enrollment is deleted                              |
| `courses/enrollment.suspended`                   | V2                 | Sent when a Course::Enrollment has been suspended                      |
| `courses/enrollment.course_completed`                   | V2                 | Sent when a Course::Enrollment completes a course                      |
| 
***Courses::Section***                           |                    |                                                                        |
| `courses/section.created`                        | V2             | Sent when a Courses::Section is created                                |
| `courses/section.updated`                        | V2             | Sent when a Courses::Section is updated                                |
| `courses/section.deleted`                        | V2             | Sent when a Courses::Section is deleted                                |
| `courses/section.published`                       | V2                 | Sent when a Courses::Lesson has been published                         |
|                      |
***Courses::Lesson***                            |                    |                                                                        |
| `courses/lesson.created`                         | V2             | Sent when a Courses::Lesson is created                                 |
| `courses/lesson.updated`                         | V2             | Sent when a Courses::Lesson is updated                                 |
| `courses/lesson.deleted`                         | V2             | Sent when a Courses::Lesson is deleted                                 |
| `courses/lesson.published`                       | V2                 | Sent when a Courses::Lesson has been published                         |
|                      |

**Form submission webhooks**

Currently only available in V1 with the following JSON payload sample:

```json
{
  \"data\": {
    \"id\": \"4892034\",
    \"type\": \"form_submission\",
    \"attributes\": {
      \"id\": 9874322,
      \"data\": {
        \"action\": \"submit\",
        \"contact\": {
          \"email\": \"joe.doe@example.com\",
          \"aff_sub\": \"43242122e8c15480e9117143ce806d111\"
        },
        \"controller\": \"user_pages/pages\",
        \"redirect_to\": \"https://www.example.com/thank-you-newsletter\"
      },
      \"page_id\": 2342324,
      \"contact_id\": 234424,
      \"created_at\": \"2023-11-14T23:25:54.070Z\",
      \"updated_at\": \"2023-11-14T23:25:54.134Z\",
      \"workspace_id\": 11
    }
  },
  \"event_id\": \"bb50ab45-3da8-4532-9d7e-1c85d159ee71\",
  \"event_type\": \"form_submission.created\",
  \"subject_id\": 9894793,
  \"subject_type\": \"FormSubmission\"
}
```

| <div style=\"width:375px;\">Event type</div>| Versions available | Description                             | 
|--------------------------------------------------|--------------------|-----------------------------------------|
| ***Form::Submission***                           |                    |                                         |
| `form/submission.created`                        | V1                 | Sent when a Form::Submission is created |

**Order webhooks**

Subscriptions and orders are all of type \"Order\" and their payload will be as in the [Order resources
response payload](https://apidocs.myclickfunnels.com/tag/Order#operation/getOrders).

| <div style=\"width:375px;\">Event type</div> | Versions available | Description                                                                                               | 
|--------------------------------------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| ***Order***                                |                    |                                                                                                           |
| `order.created`                            | V1, V2             | Sent when an Order has been created                                                                       |
| `order.updated`                            | V1, V2             | Sent when an Order has been updated                                                                       |
| `order.deleted`                            | V1, V2             | Sent when an Order has been deleted                                                                       |
| `order.completed`                          | V1, V2             | Sent when a one-time order was paid or a subscription order's service period has concluded                |
| ***One-Time Order***                       |                    |                                                                                                           |
| `one-time-order.completed`                 | V1, V2             | Sent when an Order of `order_type: \"one-time-order\"` has been completed                                   |
| `one_time_order.refunded`                  | V1, V2             | Sent when an Order of `order_type: \"one-time-order\"` refund has been issued                               |
| ***Subscription***                         |                    |                                                                                                           |
| `subscription.canceled`                    | V1, V2             | Sent when an Order of `order_type: \"subscription\"` has been canceled                                      |
| `subscription.reactivated`                 | V1, V2             | Sent when an Order of `order_type: \"subscription\"` that was canceled was reactivated                      |
| `subscription.downgraded`                  | V1, V2             | Sent when an Order of `order_type: \"subscription\"` is changed to a product of smaller value               |
| `subscription.upgraded`                    | V1, V2             | Sent when an Order of `order_type: \"subscription\"` is changed to a product of higher value                |
| `subscription.churned`                     | V1, V2             | Sent when an Order of `order_type: \"subscription\"` has been churned                                       |
| `subscription.modified`                    | V1, V2             | Sent when an Order of `order_type: \"subscription\"` has been modified                                      |
| `subscription.activated`                   | V1, V2             | Sent when an Order of `order_type: \"subscription\"` has been activated                                     |
| `subscription.completed`                   | V1, V2             | Sent when an Order of `order_type: \"subscription\"` has been completed                                     |
| `subscription.first_payment_received`      | V1, V2             | Sent when an Order of `order_type: \"subscription\"` received first non-setup payment for subscription item |

**Orders::Transaction Webhooks**

Orders transactions are currently not part of our V2 API, but you can refer to this sample V2 webhook data payload: 

```json
{
  \"id\": 1821233,
  \"arn\": null,
  \"amount\": \"200.00\",
  \"reason\": null,
  \"result\": \"approved\",
  \"status\": \"completed\",
  \"currency\": \"USD\",
  \"order_id\": 110030,
  \"is_rebill\": false,
  \"public_id\": \"asLOAY\",
  \"created_at\": \"2024-01-30T06:25:06.754Z\",
  \"updated_at\": \"2024-01-30T06:25:06.754Z\",
  \"external_id\": \"txn_01HNCGNQE2C234PCFNERD2AVFZ\",
  \"external_type\": \"sale\",
  \"rebill_number\": 0,
  \"adjusted_transaction_id\": null,
  \"billing_payment_instruction_id\": 1333223,
  \"billing_payment_instruction_type\": \"Billing::PaymentMethod\"
}
```

| <div style=\"width:375px;\">Event type</div>                            | Versions available | Description                                       | 
|---------------------------------------|--------------------|---------------------------------------------------|
| ***Orders::Transaction***                      |                    |                                                   |
| `orders/transaction.created`                   | V1, V2             | Sent when an Orders::Transaction has been created |
| `orders/transaction.updated`                   | V1, V2             | Sent when an Orders::Transaction has been updated |

**Invoice webhooks**

With the [Invoice payload](https://apidocs.myclickfunnels.com/tag/Orders::Invoice).

| <div style=\"width:375px;\">Event type</div>   | Versions available   | Description                                                                 | 
|----------------------------------------------|----------------------|-----------------------------------------------------------------------------|
| ***Orders::Invoice***                        |                      |                                                                             |
| `orders/invoice.created`                     | V1, V2               | Sent when an Orders::Invoice has been created                               |
| `orders/invoice.updated`                     | V1, V2               | Sent when an Orders::Invoice has been updated                               |
| `orders/invoice.refunded`                    | V1, V2               | Sent when an Orders::Invoice has been refunded                              |
| `renewal-invoice-payment-declined`           | V1, V2               | Issued when a renewal Orders::Invoice payment has been declined             |
| ***OneTimeOrder::Invoice***                  |                      |                                                                             |
| `one-time-order.invoice.paid`                | V1, V2               | Sent when an Order::Invoice of `order_type: \"one-time-order\"` has been paid |
| ***Subscription::Invoice***                  |                      |                                                                             |
| `subscription/invoice.paid`                  | V1, V2               | Sent when an Order of `order_type: \"subscription\"` has been paid            |

**Workflow-based webhooks**

These are mostly used for [the UI-based ClickFunnels Workflows functionality](https://support.myclickfunnels.com/support/solutions/articles/150000156983-using-the-webhook-step-in-a-workflow).

| <div style=\"width:375px;\">Event type</div>| Versions available | Description                                                        | 
|--------------------------------------------------|--------------------|--------------------------------------------------------------------| 
| ***Runs::Step***                                 |                    |                                                                    |
| `runs/step.dontrunme`                            | V1                 | Issued when the `dontrunme` step has been ran on a Workflow        |
| ***Workflows::Integration::Step***               |                    |                                                                    |
| `workflows_integration_step.executed`            | V1                 | Sent when a Workflows::Integration::Step has been executed         |
| ***Workflows::Steps::IntegrationStep***          |                    |                                                                    |
| `workflows/steps/integration_step.executed`      | V1                 | Sent when a Workflows::Steps::IntegrationStep has been executed    |
| ***Workflows::Steps::DeliverWebhookStep***       |                    |                                                                    |
| `workflows/steps/deliver_webhook_step.executed`  | V1                 | Sent when a Workflows::Steps::DeliverWebhookStep has been executed |


The version of the OpenAPI document: V2


NOTE: This file is auto generated by Konfig (https://konfigthis.com).
*/

import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction, isBrowser } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ProductAddNewToWorkspace401Response } from '../models';
// @ts-ignore
import { ProductAddNewToWorkspaceRequest } from '../models';
// @ts-ignore
import { ProductAddNewToWorkspaceResponse } from '../models';
// @ts-ignore
import { ProductAttributes } from '../models';
// @ts-ignore
import { ProductGetForWorkspace404Response } from '../models';
// @ts-ignore
import { ProductGetForWorkspaceResponse } from '../models';
// @ts-ignore
import { ProductListForWorkspace401Response } from '../models';
// @ts-ignore
import { ProductListForWorkspace404Response } from '../models';
// @ts-ignore
import { ProductUpdateForWorkspace401Response } from '../models';
// @ts-ignore
import { ProductUpdateForWorkspace404Response } from '../models';
// @ts-ignore
import { ProductUpdateForWorkspaceRequest } from '../models';
// @ts-ignore
import { ProductUpdateForWorkspaceResponse } from '../models';
import { paginate } from "../pagination/paginate";
import type * as buffer from "buffer"
import { requestBeforeHook } from '../requestBeforeHook';
/**
 * ProductApi - axios parameter creator
 * @export
 */
export const ProductApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Add a new product to a workspace
         * @summary Create Product
         * @param {number} workspaceId 
         * @param {ProductAddNewToWorkspaceRequest} productAddNewToWorkspaceRequest Information about a new Product
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addNewToWorkspace: async (workspaceId: number, productAddNewToWorkspaceRequest: ProductAddNewToWorkspaceRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'workspaceId' is not null or undefined
            assertParamExists('addNewToWorkspace', 'workspaceId', workspaceId)
            // verify required parameter 'productAddNewToWorkspaceRequest' is not null or undefined
            assertParamExists('addNewToWorkspace', 'productAddNewToWorkspaceRequest', productAddNewToWorkspaceRequest)
            const localVarPath = `/workspaces/{workspace_id}/products`
                .replace(`{${"workspace_id"}}`, encodeURIComponent(String(workspaceId !== undefined ? workspaceId : `-workspace_id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

    
            localVarHeaderParameter['Content-Type'] = 'application/json';


            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: productAddNewToWorkspaceRequest,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/workspaces/{workspace_id}/products',
                httpMethod: 'POST'
            });
            localVarRequestOptions.data = serializeDataIfNeeded(productAddNewToWorkspaceRequest, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * This will archive a Product. A product can only be archived if it\'s not in the \"live\" state.
         * @summary Archive a Product
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        archiveProduct: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('archiveProduct', 'id', id)
            const localVarPath = `/products/{id}/archive`
                .replace(`{${"id"}}`, encodeURIComponent(String(id !== undefined ? id : `-id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/products/{id}/archive',
                httpMethod: 'POST'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieve a product for a workspace
         * @summary Fetch Product
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getForWorkspace: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getForWorkspace', 'id', id)
            const localVarPath = `/products/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id !== undefined ? id : `-id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/products/{id}',
                httpMethod: 'GET'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * List products for a workspace. All products are listed regardless of `archived` state.
         * @summary List Products
         * @param {number} workspaceId 
         * @param {string} [after] ID of item after which the collection should be returned
         * @param {'asc' | 'desc'} [sortOrder] Sort order of a list response. Use \&#39;desc\&#39; to reverse the default \&#39;asc\&#39; (ascending) sort order.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listForWorkspace: async (workspaceId: number, after?: string, sortOrder?: 'asc' | 'desc', options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'workspaceId' is not null or undefined
            assertParamExists('listForWorkspace', 'workspaceId', workspaceId)
            const localVarPath = `/workspaces/{workspace_id}/products`
                .replace(`{${"workspace_id"}}`, encodeURIComponent(String(workspaceId !== undefined ? workspaceId : `-workspace_id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)
            if (after !== undefined) {
                localVarQueryParameter['after'] = after;
            }

            if (sortOrder !== undefined) {
                localVarQueryParameter['sort_order'] = sortOrder;
            }


    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/workspaces/{workspace_id}/products',
                httpMethod: 'GET'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * This will unarchive a Product.
         * @summary Unarchive a Product
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        unarchiveById: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('unarchiveById', 'id', id)
            const localVarPath = `/products/{id}/unarchive`
                .replace(`{${"id"}}`, encodeURIComponent(String(id !== undefined ? id : `-id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

    
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/products/{id}/unarchive',
                httpMethod: 'POST'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Update a product for a workspace
         * @summary Update Product
         * @param {string} id 
         * @param {ProductUpdateForWorkspaceRequest} productUpdateForWorkspaceRequest Information about updated fields in Product
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateForWorkspace: async (id: string, productUpdateForWorkspaceRequest: ProductUpdateForWorkspaceRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateForWorkspace', 'id', id)
            // verify required parameter 'productUpdateForWorkspaceRequest' is not null or undefined
            assertParamExists('updateForWorkspace', 'productUpdateForWorkspaceRequest', productUpdateForWorkspaceRequest)
            const localVarPath = `/products/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id !== undefined ? id : `-id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = configuration && !isBrowser() ? { "User-Agent": configuration.userAgent } : {} as any;
            const localVarQueryParameter = {} as any;

            // authentication BearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

    
            localVarHeaderParameter['Content-Type'] = 'application/json';


            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            requestBeforeHook({
                requestBody: productUpdateForWorkspaceRequest,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/products/{id}',
                httpMethod: 'PUT'
            });
            localVarRequestOptions.data = serializeDataIfNeeded(productUpdateForWorkspaceRequest, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ProductApi - functional programming interface
 * @export
 */
export const ProductApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ProductApiAxiosParamCreator(configuration)
    return {
        /**
         * Add a new product to a workspace
         * @summary Create Product
         * @param {ProductApiAddNewToWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addNewToWorkspace(requestParameters: ProductApiAddNewToWorkspaceRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProductAttributes>> {
            const productAddNewToWorkspaceRequest: ProductAddNewToWorkspaceRequest = {
                product: requestParameters.product
            };
            const localVarAxiosArgs = await localVarAxiosParamCreator.addNewToWorkspace(requestParameters.workspaceId, productAddNewToWorkspaceRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * This will archive a Product. A product can only be archived if it\'s not in the \"live\" state.
         * @summary Archive a Product
         * @param {ProductApiArchiveProductRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async archiveProduct(requestParameters: ProductApiArchiveProductRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProductAttributes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.archiveProduct(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieve a product for a workspace
         * @summary Fetch Product
         * @param {ProductApiGetForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getForWorkspace(requestParameters: ProductApiGetForWorkspaceRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProductAttributes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getForWorkspace(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * List products for a workspace. All products are listed regardless of `archived` state.
         * @summary List Products
         * @param {ProductApiListForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listForWorkspace(requestParameters: ProductApiListForWorkspaceRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ProductAttributes>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listForWorkspace(requestParameters.workspaceId, requestParameters.after, requestParameters.sortOrder, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * This will unarchive a Product.
         * @summary Unarchive a Product
         * @param {ProductApiUnarchiveByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async unarchiveById(requestParameters: ProductApiUnarchiveByIdRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProductAttributes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.unarchiveById(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update a product for a workspace
         * @summary Update Product
         * @param {ProductApiUpdateForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateForWorkspace(requestParameters: ProductApiUpdateForWorkspaceRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProductAttributes>> {
            const productUpdateForWorkspaceRequest: ProductUpdateForWorkspaceRequest = {
                product: requestParameters.product
            };
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateForWorkspace(requestParameters.id, productUpdateForWorkspaceRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ProductApi - factory interface
 * @export
 */
export const ProductApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ProductApiFp(configuration)
    return {
        /**
         * Add a new product to a workspace
         * @summary Create Product
         * @param {ProductApiAddNewToWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addNewToWorkspace(requestParameters: ProductApiAddNewToWorkspaceRequest, options?: AxiosRequestConfig): AxiosPromise<ProductAttributes> {
            return localVarFp.addNewToWorkspace(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * This will archive a Product. A product can only be archived if it\'s not in the \"live\" state.
         * @summary Archive a Product
         * @param {ProductApiArchiveProductRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        archiveProduct(requestParameters: ProductApiArchiveProductRequest, options?: AxiosRequestConfig): AxiosPromise<ProductAttributes> {
            return localVarFp.archiveProduct(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieve a product for a workspace
         * @summary Fetch Product
         * @param {ProductApiGetForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getForWorkspace(requestParameters: ProductApiGetForWorkspaceRequest, options?: AxiosRequestConfig): AxiosPromise<ProductAttributes> {
            return localVarFp.getForWorkspace(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * List products for a workspace. All products are listed regardless of `archived` state.
         * @summary List Products
         * @param {ProductApiListForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listForWorkspace(requestParameters: ProductApiListForWorkspaceRequest, options?: AxiosRequestConfig): AxiosPromise<Array<ProductAttributes>> {
            return localVarFp.listForWorkspace(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * This will unarchive a Product.
         * @summary Unarchive a Product
         * @param {ProductApiUnarchiveByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        unarchiveById(requestParameters: ProductApiUnarchiveByIdRequest, options?: AxiosRequestConfig): AxiosPromise<ProductAttributes> {
            return localVarFp.unarchiveById(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Update a product for a workspace
         * @summary Update Product
         * @param {ProductApiUpdateForWorkspaceRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateForWorkspace(requestParameters: ProductApiUpdateForWorkspaceRequest, options?: AxiosRequestConfig): AxiosPromise<ProductAttributes> {
            return localVarFp.updateForWorkspace(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for addNewToWorkspace operation in ProductApi.
 * @export
 * @interface ProductApiAddNewToWorkspaceRequest
 */
export type ProductApiAddNewToWorkspaceRequest = {
    
    /**
    * 
    * @type {number}
    * @memberof ProductApiAddNewToWorkspace
    */
    readonly workspaceId: number
    
} & ProductAddNewToWorkspaceRequest

/**
 * Request parameters for archiveProduct operation in ProductApi.
 * @export
 * @interface ProductApiArchiveProductRequest
 */
export type ProductApiArchiveProductRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof ProductApiArchiveProduct
    */
    readonly id: string
    
}

/**
 * Request parameters for getForWorkspace operation in ProductApi.
 * @export
 * @interface ProductApiGetForWorkspaceRequest
 */
export type ProductApiGetForWorkspaceRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof ProductApiGetForWorkspace
    */
    readonly id: string
    
}

/**
 * Request parameters for listForWorkspace operation in ProductApi.
 * @export
 * @interface ProductApiListForWorkspaceRequest
 */
export type ProductApiListForWorkspaceRequest = {
    
    /**
    * 
    * @type {number}
    * @memberof ProductApiListForWorkspace
    */
    readonly workspaceId: number
    
    /**
    * ID of item after which the collection should be returned
    * @type {string}
    * @memberof ProductApiListForWorkspace
    */
    readonly after?: string
    
    /**
    * Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.
    * @type {'asc' | 'desc'}
    * @memberof ProductApiListForWorkspace
    */
    readonly sortOrder?: 'asc' | 'desc'
    
}

/**
 * Request parameters for unarchiveById operation in ProductApi.
 * @export
 * @interface ProductApiUnarchiveByIdRequest
 */
export type ProductApiUnarchiveByIdRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof ProductApiUnarchiveById
    */
    readonly id: string
    
}

/**
 * Request parameters for updateForWorkspace operation in ProductApi.
 * @export
 * @interface ProductApiUpdateForWorkspaceRequest
 */
export type ProductApiUpdateForWorkspaceRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof ProductApiUpdateForWorkspace
    */
    readonly id: string
    
} & ProductUpdateForWorkspaceRequest

/**
 * ProductApiGenerated - object-oriented interface
 * @export
 * @class ProductApiGenerated
 * @extends {BaseAPI}
 */
export class ProductApiGenerated extends BaseAPI {
    /**
     * Add a new product to a workspace
     * @summary Create Product
     * @param {ProductApiAddNewToWorkspaceRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public addNewToWorkspace(requestParameters: ProductApiAddNewToWorkspaceRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).addNewToWorkspace(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This will archive a Product. A product can only be archived if it\'s not in the \"live\" state.
     * @summary Archive a Product
     * @param {ProductApiArchiveProductRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public archiveProduct(requestParameters: ProductApiArchiveProductRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).archiveProduct(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieve a product for a workspace
     * @summary Fetch Product
     * @param {ProductApiGetForWorkspaceRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public getForWorkspace(requestParameters: ProductApiGetForWorkspaceRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).getForWorkspace(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * List products for a workspace. All products are listed regardless of `archived` state.
     * @summary List Products
     * @param {ProductApiListForWorkspaceRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public listForWorkspace(requestParameters: ProductApiListForWorkspaceRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).listForWorkspace(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This will unarchive a Product.
     * @summary Unarchive a Product
     * @param {ProductApiUnarchiveByIdRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public unarchiveById(requestParameters: ProductApiUnarchiveByIdRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).unarchiveById(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update a product for a workspace
     * @summary Update Product
     * @param {ProductApiUpdateForWorkspaceRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApiGenerated
     */
    public updateForWorkspace(requestParameters: ProductApiUpdateForWorkspaceRequest, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).updateForWorkspace(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}