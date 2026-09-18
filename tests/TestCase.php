<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Seeding the full catalog once per test keeps the suite honest: the tests
     * exercise the same six tracks and sixteen universities the portal ships with.
     */
    protected bool $seed = true;
}
