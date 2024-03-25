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
import { FormsSubmissionsAnswerAddNewAnswer401Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerAddNewAnswerRequest } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerAddNewAnswerResponse } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerAttributes } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerGet404Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerGetResponse } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerList401Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerList404Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerRemoveById404Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerRemoveByIdResponse } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerUpdateAnswer401Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerUpdateAnswer404Response } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerUpdateAnswerRequest } from '../models';
// @ts-ignore
import { FormsSubmissionsAnswerUpdateAnswerResponse } from '../models';
import { paginate } from "../pagination/paginate";
import type * as buffer from "buffer"
import { requestBeforeHook } from '../requestBeforeHook';
/**
 * FormsSubmissionsAnswerApi - axios parameter creator
 * @export
 */
export const FormsSubmissionsAnswerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Add a new answer to a submission
         * @summary Create Answer
         * @param {number} submissionId 
         * @param {FormsSubmissionsAnswerAddNewAnswerRequest} formsSubmissionsAnswerAddNewAnswerRequest Information about a new Answer
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addNewAnswer: async (submissionId: number, formsSubmissionsAnswerAddNewAnswerRequest: FormsSubmissionsAnswerAddNewAnswerRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'submissionId' is not null or undefined
            assertParamExists('addNewAnswer', 'submissionId', submissionId)
            // verify required parameter 'formsSubmissionsAnswerAddNewAnswerRequest' is not null or undefined
            assertParamExists('addNewAnswer', 'formsSubmissionsAnswerAddNewAnswerRequest', formsSubmissionsAnswerAddNewAnswerRequest)
            const localVarPath = `/forms/submissions/{submission_id}/answers`
                .replace(`{${"submission_id"}}`, encodeURIComponent(String(submissionId !== undefined ? submissionId : `-submission_id-`)));
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
                requestBody: formsSubmissionsAnswerAddNewAnswerRequest,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/forms/submissions/{submission_id}/answers',
                httpMethod: 'POST'
            });
            localVarRequestOptions.data = serializeDataIfNeeded(formsSubmissionsAnswerAddNewAnswerRequest, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Retrieve a answer for a submission
         * @summary Fetch Answer
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('get', 'id', id)
            const localVarPath = `/forms/submissions/answers/{id}`
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
                pathTemplate: '/forms/submissions/answers/{id}',
                httpMethod: 'GET'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * List answers for a submission
         * @summary List Answers
         * @param {number} submissionId 
         * @param {string} [after] ID of item after which the collection should be returned
         * @param {'asc' | 'desc'} [sortOrder] Sort order of a list response. Use \&#39;desc\&#39; to reverse the default \&#39;asc\&#39; (ascending) sort order.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list: async (submissionId: number, after?: string, sortOrder?: 'asc' | 'desc', options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'submissionId' is not null or undefined
            assertParamExists('list', 'submissionId', submissionId)
            const localVarPath = `/forms/submissions/{submission_id}/answers`
                .replace(`{${"submission_id"}}`, encodeURIComponent(String(submissionId !== undefined ? submissionId : `-submission_id-`)));
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
                pathTemplate: '/forms/submissions/{submission_id}/answers',
                httpMethod: 'GET'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Delete a answer for a submission
         * @summary Remove Answer
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeById: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('removeById', 'id', id)
            const localVarPath = `/forms/submissions/answers/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id !== undefined ? id : `-id-`)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions: AxiosRequestConfig = { method: 'DELETE', ...baseOptions, ...options};
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
                pathTemplate: '/forms/submissions/answers/{id}',
                httpMethod: 'DELETE'
            });

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Update a answer for a submission
         * @summary Update Answer
         * @param {string} id 
         * @param {FormsSubmissionsAnswerUpdateAnswerRequest} formsSubmissionsAnswerUpdateAnswerRequest Information about updated fields in Answer
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateAnswer: async (id: string, formsSubmissionsAnswerUpdateAnswerRequest: FormsSubmissionsAnswerUpdateAnswerRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateAnswer', 'id', id)
            // verify required parameter 'formsSubmissionsAnswerUpdateAnswerRequest' is not null or undefined
            assertParamExists('updateAnswer', 'formsSubmissionsAnswerUpdateAnswerRequest', formsSubmissionsAnswerUpdateAnswerRequest)
            const localVarPath = `/forms/submissions/answers/{id}`
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
                requestBody: formsSubmissionsAnswerUpdateAnswerRequest,
                queryParameters: localVarQueryParameter,
                requestConfig: localVarRequestOptions,
                path: localVarPath,
                configuration,
                pathTemplate: '/forms/submissions/answers/{id}',
                httpMethod: 'PUT'
            });
            localVarRequestOptions.data = serializeDataIfNeeded(formsSubmissionsAnswerUpdateAnswerRequest, localVarRequestOptions, configuration)

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FormsSubmissionsAnswerApi - functional programming interface
 * @export
 */
export const FormsSubmissionsAnswerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FormsSubmissionsAnswerApiAxiosParamCreator(configuration)
    return {
        /**
         * Add a new answer to a submission
         * @summary Create Answer
         * @param {FormsSubmissionsAnswerApiAddNewAnswerRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addNewAnswer(requestParameters: FormsSubmissionsAnswerApiAddNewAnswerRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FormsSubmissionsAnswerAttributes>> {
            const formsSubmissionsAnswerAddNewAnswerRequest: FormsSubmissionsAnswerAddNewAnswerRequest = {
                forms_submissions_answer: requestParameters.forms_submissions_answer
            };
            const localVarAxiosArgs = await localVarAxiosParamCreator.addNewAnswer(requestParameters.submissionId, formsSubmissionsAnswerAddNewAnswerRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Retrieve a answer for a submission
         * @summary Fetch Answer
         * @param {FormsSubmissionsAnswerApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async get(requestParameters: FormsSubmissionsAnswerApiGetRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FormsSubmissionsAnswerAttributes>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.get(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * List answers for a submission
         * @summary List Answers
         * @param {FormsSubmissionsAnswerApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async list(requestParameters: FormsSubmissionsAnswerApiListRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<FormsSubmissionsAnswerAttributes>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.list(requestParameters.submissionId, requestParameters.after, requestParameters.sortOrder, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Delete a answer for a submission
         * @summary Remove Answer
         * @param {FormsSubmissionsAnswerApiRemoveByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async removeById(requestParameters: FormsSubmissionsAnswerApiRemoveByIdRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.removeById(requestParameters.id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update a answer for a submission
         * @summary Update Answer
         * @param {FormsSubmissionsAnswerApiUpdateAnswerRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateAnswer(requestParameters: FormsSubmissionsAnswerApiUpdateAnswerRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FormsSubmissionsAnswerAttributes>> {
            const formsSubmissionsAnswerUpdateAnswerRequest: FormsSubmissionsAnswerUpdateAnswerRequest = {
                forms_submissions_answer: requestParameters.forms_submissions_answer
            };
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateAnswer(requestParameters.id, formsSubmissionsAnswerUpdateAnswerRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * FormsSubmissionsAnswerApi - factory interface
 * @export
 */
export const FormsSubmissionsAnswerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FormsSubmissionsAnswerApiFp(configuration)
    return {
        /**
         * Add a new answer to a submission
         * @summary Create Answer
         * @param {FormsSubmissionsAnswerApiAddNewAnswerRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addNewAnswer(requestParameters: FormsSubmissionsAnswerApiAddNewAnswerRequest, options?: AxiosRequestConfig): AxiosPromise<FormsSubmissionsAnswerAttributes> {
            return localVarFp.addNewAnswer(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Retrieve a answer for a submission
         * @summary Fetch Answer
         * @param {FormsSubmissionsAnswerApiGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        get(requestParameters: FormsSubmissionsAnswerApiGetRequest, options?: AxiosRequestConfig): AxiosPromise<FormsSubmissionsAnswerAttributes> {
            return localVarFp.get(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * List answers for a submission
         * @summary List Answers
         * @param {FormsSubmissionsAnswerApiListRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        list(requestParameters: FormsSubmissionsAnswerApiListRequest, options?: AxiosRequestConfig): AxiosPromise<Array<FormsSubmissionsAnswerAttributes>> {
            return localVarFp.list(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Delete a answer for a submission
         * @summary Remove Answer
         * @param {FormsSubmissionsAnswerApiRemoveByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeById(requestParameters: FormsSubmissionsAnswerApiRemoveByIdRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.removeById(requestParameters, options).then((request) => request(axios, basePath));
        },
        /**
         * Update a answer for a submission
         * @summary Update Answer
         * @param {FormsSubmissionsAnswerApiUpdateAnswerRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateAnswer(requestParameters: FormsSubmissionsAnswerApiUpdateAnswerRequest, options?: AxiosRequestConfig): AxiosPromise<FormsSubmissionsAnswerAttributes> {
            return localVarFp.updateAnswer(requestParameters, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for addNewAnswer operation in FormsSubmissionsAnswerApi.
 * @export
 * @interface FormsSubmissionsAnswerApiAddNewAnswerRequest
 */
export type FormsSubmissionsAnswerApiAddNewAnswerRequest = {
    
    /**
    * 
    * @type {number}
    * @memberof FormsSubmissionsAnswerApiAddNewAnswer
    */
    readonly submissionId: number
    
} & FormsSubmissionsAnswerAddNewAnswerRequest

/**
 * Request parameters for get operation in FormsSubmissionsAnswerApi.
 * @export
 * @interface FormsSubmissionsAnswerApiGetRequest
 */
export type FormsSubmissionsAnswerApiGetRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof FormsSubmissionsAnswerApiGet
    */
    readonly id: string
    
}

/**
 * Request parameters for list operation in FormsSubmissionsAnswerApi.
 * @export
 * @interface FormsSubmissionsAnswerApiListRequest
 */
export type FormsSubmissionsAnswerApiListRequest = {
    
    /**
    * 
    * @type {number}
    * @memberof FormsSubmissionsAnswerApiList
    */
    readonly submissionId: number
    
    /**
    * ID of item after which the collection should be returned
    * @type {string}
    * @memberof FormsSubmissionsAnswerApiList
    */
    readonly after?: string
    
    /**
    * Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.
    * @type {'asc' | 'desc'}
    * @memberof FormsSubmissionsAnswerApiList
    */
    readonly sortOrder?: 'asc' | 'desc'
    
}

/**
 * Request parameters for removeById operation in FormsSubmissionsAnswerApi.
 * @export
 * @interface FormsSubmissionsAnswerApiRemoveByIdRequest
 */
export type FormsSubmissionsAnswerApiRemoveByIdRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof FormsSubmissionsAnswerApiRemoveById
    */
    readonly id: string
    
}

/**
 * Request parameters for updateAnswer operation in FormsSubmissionsAnswerApi.
 * @export
 * @interface FormsSubmissionsAnswerApiUpdateAnswerRequest
 */
export type FormsSubmissionsAnswerApiUpdateAnswerRequest = {
    
    /**
    * 
    * @type {string}
    * @memberof FormsSubmissionsAnswerApiUpdateAnswer
    */
    readonly id: string
    
} & FormsSubmissionsAnswerUpdateAnswerRequest

/**
 * FormsSubmissionsAnswerApiGenerated - object-oriented interface
 * @export
 * @class FormsSubmissionsAnswerApiGenerated
 * @extends {BaseAPI}
 */
export class FormsSubmissionsAnswerApiGenerated extends BaseAPI {
    /**
     * Add a new answer to a submission
     * @summary Create Answer
     * @param {FormsSubmissionsAnswerApiAddNewAnswerRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsSubmissionsAnswerApiGenerated
     */
    public addNewAnswer(requestParameters: FormsSubmissionsAnswerApiAddNewAnswerRequest, options?: AxiosRequestConfig) {
        return FormsSubmissionsAnswerApiFp(this.configuration).addNewAnswer(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Retrieve a answer for a submission
     * @summary Fetch Answer
     * @param {FormsSubmissionsAnswerApiGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsSubmissionsAnswerApiGenerated
     */
    public get(requestParameters: FormsSubmissionsAnswerApiGetRequest, options?: AxiosRequestConfig) {
        return FormsSubmissionsAnswerApiFp(this.configuration).get(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * List answers for a submission
     * @summary List Answers
     * @param {FormsSubmissionsAnswerApiListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsSubmissionsAnswerApiGenerated
     */
    public list(requestParameters: FormsSubmissionsAnswerApiListRequest, options?: AxiosRequestConfig) {
        return FormsSubmissionsAnswerApiFp(this.configuration).list(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Delete a answer for a submission
     * @summary Remove Answer
     * @param {FormsSubmissionsAnswerApiRemoveByIdRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsSubmissionsAnswerApiGenerated
     */
    public removeById(requestParameters: FormsSubmissionsAnswerApiRemoveByIdRequest, options?: AxiosRequestConfig) {
        return FormsSubmissionsAnswerApiFp(this.configuration).removeById(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update a answer for a submission
     * @summary Update Answer
     * @param {FormsSubmissionsAnswerApiUpdateAnswerRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FormsSubmissionsAnswerApiGenerated
     */
    public updateAnswer(requestParameters: FormsSubmissionsAnswerApiUpdateAnswerRequest, options?: AxiosRequestConfig) {
        return FormsSubmissionsAnswerApiFp(this.configuration).updateAnswer(requestParameters, options).then((request) => request(this.axios, this.basePath));
    }
}
